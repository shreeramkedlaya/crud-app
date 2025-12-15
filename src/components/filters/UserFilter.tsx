import { useState } from 'react';

type Props = {
    initial?: Partial<{ query: string; education: string }>;
    onApply: (filters: { query: string; education: string }) => void;
    onClear: () => void;
    onClose?: () => void;
    hasData?: boolean;
};

const educationOptions = [
    '',
    'High School',
    'Diploma',
    'Associate Degree',
    "Bachelor's Degree",
    "Master's Degree",
    'Doctorate (PhD)',
];

export default function UserFilter({ initial, onApply, onClear, onClose, hasData = true }: Props) {
    const [query, setQuery] = useState(initial?.query || '');
    const [education, setEducation] = useState(initial?.education || '');


    return (
        <div className="bg-white shadow rounded p-4 w-80">
            <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Filters</div>
                <button onClick={onClose} aria-label="Close" className="text-gray-500">✕</button>
            </div>

            <div className="space-y-3">
                {!hasData ? (
                    <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded">No users to filter.</div>
                ) : (
                    <>
                        <div>
                            <label className="block text-sm text-gray-600">Search</label>
                            <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full border p-2 rounded" placeholder="Search name, mobile, interests..." disabled={!hasData} />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600">Education</label>
                            <select value={education} onChange={(e) => setEducation(e.target.value)} className="w-full border p-2 rounded" disabled={!hasData}>
                                {educationOptions.map((ed) => (
                                    <option key={ed} value={ed}>{ed || 'Any'}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => { setQuery(''); setEducation(''); onClear(); }} className="px-3 py-1 border rounded">Clear</button>
                            <button type="button" onClick={() => onApply({ query, education })} className="px-3 py-1 bg-blue-600 text-white rounded" disabled={!hasData}>Apply</button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}
