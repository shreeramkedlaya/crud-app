import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import useUsers from "../../hooks/useUsers";
import type { User } from "../../data/userService";
import FormField from "./FormField";

const educationOptions = [
    "High School",
    "Diploma",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate (PhD)",
];

const interestOptions = [
    "Sports",
    "Music",
    "Technology",
    "Art",
    "Travel",
    "Food",
    "Fitness",
];
interface FormProps {
    mode?: "create" | "edit";
    defaultValues?: Partial<User>;
    userId?: number;
}

const UserForm: React.FC<FormProps> = ({ mode = "create", defaultValues = {}, userId }) => {
    const navigate = useNavigate();
    const { addUser, updateUser } = useUsers();
    const { getUser } = useUsers();
    const params = useParams();

    // ------------------------------------
    // FORM STATES
    // ------------------------------------
    const [firstName, setFirstName] = useState(defaultValues?.firstName || "");
    const [lastName, setLastName] = useState(defaultValues?.lastName || "");
    const [mobile, setMobile] = useState(defaultValues?.mobile || "");
    const [address, setAddress] = useState(defaultValues?.address || "");
    const [age, setAge] = useState(defaultValues?.age || 18);
    const [gender, setGender] = useState(defaultValues?.gender || "");
    const [education, setEducation] = useState(defaultValues?.education || "");
    const [interests, setInterests] = useState(defaultValues?.interests || []);
    const [availabilityDate, setAvailabilityDate] = useState(
        // normalize stored dd-mm-yyyy into yyyy-mm-dd for the date input
        defaultValues?.availabilityDate
            ? (() => {
                const v = defaultValues.availabilityDate;
                const m = v.match(/^(\d{2})-(\d{2})-(\d{4})$/);
                if (m) {
                    const [, d, mo, y] = m;
                    return `${y}-${mo}-${d}`;
                }
                return v;
            })()
            : ""
    );

    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loadingUser, setLoadingUser] = useState(false);
    const [resolvedUserId, setResolvedUserId] = useState<number | undefined>(userId ?? defaultValues?.id);

    // ------------------------------------
    // VALIDATION
    // ------------------------------------
    const validate = () => {
        if (!firstName.trim()) return "First name is required.";
        if (address.trim().length < 10) return "Address must be at least 10 characters.";
        if (!availabilityDate) return "Please select a date.";

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selected = new Date(availabilityDate);
        selected.setHours(0, 0, 0, 0);

        if (selected <= today) return "Please select a future date (tomorrow or later).";

        if (!/^[0-9]{7,15}$/.test(mobile || "")) return "Enter a valid mobile number (7-15 digits).";

        if (age < 18 || age > 120) return "Enter a valid age (18-120).";

        return "";
    };

    // ------------------------------------
    // SUBMIT HANDLER
    // ------------------------------------
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const err = validate();
        if (err) {
            setError(err);
            // basic field-level hints
            const errs: Record<string, string> = {};
            if (!firstName.trim()) errs.firstName = "First name is required.";
            if (address.trim().length < 10) errs.address = "Address must be at least 10 characters.";
            setFieldErrors(errs);
            return;
        }

        setSaving(true);
        const data = {
            firstName,
            lastName,
            mobile,
            address,
            age,
            gender,
            education,
            interests,
            // store availabilityDate in dd-mm-yyyy format for display and sorting
            availabilityDate: availabilityDate ? (() => {
                const [y, m, d] = availabilityDate.split("-");
                return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
            })() : "",
        };

        try {
            if (mode === "create") await addUser(data);
            else if (mode === "edit" && resolvedUserId) await updateUser(resolvedUserId, data);
            navigate("/users");
        } finally {
            setSaving(false);
        }
    };

    // ------------------------------------
    // INTEREST CHECKBOX HANDLER
    // ------------------------------------
    const toggleInterest = (value: string) => {
        if (interests.includes(value)) {
            setInterests(interests.filter((i: string) => i !== value));
        } else {
            setInterests([...interests, value]);
        }
    };
    const today = new Date().toISOString().split("T")[0];

    // If in edit mode and no default values were provided, fetch the user using the :id param
    useEffect(() => {
        if (mode !== "edit") return;
        if (defaultValues && defaultValues.id) {
            setResolvedUserId(defaultValues.id);
            return;
        }

        const idParam = params.id;
        if (!idParam) { navigate("/users"); return; }

        let mounted = true;
        (async () => {
            setLoadingUser(true);
            try {
                const u = await getUser(Number(idParam));
                if (!mounted) return;
                if (!u) { navigate("/users"); return; }
                // populate fields
                setFirstName(u.firstName || "");
                setLastName(u.lastName || "");
                setMobile(u.mobile || "");
                setAddress(u.address || "");
                setAge(u.age ?? 18);
                setGender(u.gender || "");
                setEducation(u.education || "");
                setInterests(u.interests || []);
                // convert dd-mm-yyyy -> yyyy-mm-dd
                if (u.availabilityDate) {
                    const m = u.availabilityDate.match(/^(\d{2})-(\d{2})-(\d{4})$/);
                    if (m) {
                        const [, d, mo, y] = m;
                        setAvailabilityDate(`${y}-${mo}-${d}`);
                    } else {
                        setAvailabilityDate(u.availabilityDate);
                    }
                }
                setResolvedUserId(u.id);
            } finally {
                if (mounted) setLoadingUser(false);
            }
        })();

        return () => { mounted = false };
    }, [mode, params.id, getUser, navigate]);


    // ------------------------------------
    // RENDER
    // ------------------------------------
    if (mode === 'edit' && loadingUser) return <div className="p-6">Loading...</div>;
    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow p-6 rounded space-y-6 max-w-3xl mx-auto"
        >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {/* FIRST NAME */}
                    <FormField id="firstName" label="First Name *" error={fieldErrors.firstName}>
                        <input
                            id="firstName"
                            className="w-full border p-2 rounded"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </FormField>
                    <FormField id="lastName" label="Last Name *" error={fieldErrors.lastName}>
                        <input
                            id="lastName"
                            className="w-full border p-2 rounded"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </FormField>

                    {/* MOBILE */}
                    <FormField id="mobile" label="Mobile">
                        <input
                            id="mobile"
                            type="tel"
                            inputMode="numeric"
                            className="w-full border p-2 rounded"
                            value={mobile}
                            maxLength={15}
                            pattern="[0-9]*"
                            onChange={(e) => setMobile(e.target.value)}
                        />
                    </FormField>

                    {/* AGE */}
                    <div>
                        <label htmlFor="age" className="block font-medium">Age</label>
                        <select
                            id="age"
                            className="w-full border p-2 rounded"
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                        >
                            {Array.from({ length: 78 }, (_, i) => 18 + i).map((ageVal) => (
                                <option key={ageVal} value={ageVal}>
                                    {ageVal}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* GENDER */}
                    <div>
                        <div className="block font-medium">Gender</div>
                        <div className="flex gap-4 mt-1">
                            <label htmlFor="gender-male" className="flex items-center gap-2">
                                <input
                                    id="gender-male"
                                    name="gender"
                                    type="radio"
                                    value="Male"
                                    checked={gender === "Male"}
                                    onChange={(e) => setGender(e.target.value)}
                                />
                                <span className="ml-1">Male</span>
                            </label>

                            <label htmlFor="gender-female" className="flex items-center gap-2">
                                <input
                                    id="gender-female"
                                    name="gender"
                                    type="radio"
                                    value="Female"
                                    checked={gender === "Female"}
                                    onChange={(e) => setGender(e.target.value)}
                                />
                                <span className="ml-1">Female</span>
                            </label>

                            <label htmlFor="gender-other" className="flex items-center gap-2">
                                <input
                                    id="gender-other"
                                    name="gender"
                                    type="radio"
                                    value="Other"
                                    checked={gender === "Other"}
                                    onChange={(e) => setGender(e.target.value)}
                                />
                                <span className="ml-1">Other</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* ADDRESS */}
                    <FormField id="address" label="Address" error={fieldErrors.address}>
                        <textarea
                            id="address"
                            className="w-full border p-2 rounded h-28"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </FormField>

                    {/* EDUCATION */}
                    <div>
                        <label className="block font-medium">Education</label>
                        <select
                            id="education"
                            className="w-full border p-2 rounded"
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                        >
                            <option value="">Select education</option>
                            {educationOptions.map((ed) => (
                                <option key={ed} value={ed}>
                                    {ed}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* INTERESTS */}
                    <div>
                        <label className="block font-medium">Areas of Interest</label>
                        <div className="flex flex-wrap gap-4 mt-2">
                            {interestOptions.map((opt) => (
                                <label key={opt} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={interests.includes(opt)}
                                        onChange={() => toggleInterest(opt)}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* AVAILABILITY DATE */}
                    <div>
                        <label className="block font-medium">Date of Availability</label>
                        <input
                            id="availabilityDate"
                            type="date"
                            className="w-full border p-2 rounded"
                            min={today}
                            value={availabilityDate}
                            onChange={(e) => setAvailabilityDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="w-full md:w-64">
                <div className="text-sm text-gray-600">Actions</div>
                <div className="mt-2 flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60" disabled={saving}>{saving ? 'Saving...' : (mode === 'create' ? 'Create User' : 'Update User')}</button>
                    <button type="button" className="px-4 py-2 border rounded" onClick={() => navigate('/users')}>Cancel</button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
            )}
        </form>
    );
}
export default UserForm