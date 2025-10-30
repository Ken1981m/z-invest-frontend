const maaneder = [
    { value: 1, label: "Januar" },
    { value: 2, label: "Februar" },
    { value: 3, label: "Mars" },
    { value: 4, label: "April" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" }
];

interface MonthSelectProps {
    value: string | "";
    onChange: (value: number) => void;
}

export function MonthSelect({ value, onChange }: MonthSelectProps) {
    return (
        <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
            <option value="">Velg måned…</option>
            {maaneder.map((m) => (
                <option key={m.value} value={m.value}>
                    {m.label}
                </option>
            ))}
        </select>
    );
}