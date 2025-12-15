import { useCallback, useState } from "react";

export default function useToggle(initial = false): [boolean, () => void, (v: boolean) => void] {
    const [on, setOn] = useState(initial);
    const toggle = useCallback(() => setOn((s) => !s), []);
    return [on, toggle, setOn];
}
