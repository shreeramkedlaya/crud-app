export default function useFormatDate() {
    const formatReadable = (dateStr?: string | null) => {
        if (!dateStr) return "";
        // Accept dd-mm-yyyy or yyyy-mm-dd or ISO strings
        let iso = dateStr;
        const m = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (m) {
            const [, d, mo, y] = m;
            iso = `${y}-${mo}-${d}`;
        }
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    };

    const toDDMMYYYY = (dateStr?: string | null) => {
        if (!dateStr) return "";
        const m = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        let dObj: Date;
        if (m) {
            const [, d, mo, y] = m;
            dObj = new Date(`${y}-${mo}-${d}`);
        } else {
            dObj = new Date(dateStr);
        }
        if (Number.isNaN(dObj.getTime())) return dateStr;
        const dd = String(dObj.getDate()).padStart(2, "0");
        const mm = String(dObj.getMonth() + 1).padStart(2, "0");
        const yyyy = dObj.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    };

    const parseToTimestamp = (s?: string) => {
        if (!s) return 0;
        const m = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (m) {
            const [, d, mo, y] = m;
            return new Date(Number(y), Number(mo) - 1, Number(d)).getTime();
        }
        const t = new Date(s).getTime();
        return Number.isNaN(t) ? 0 : t;
    };

    return { formatReadable, toDDMMYYYY, parseToTimestamp };
}
