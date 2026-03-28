"use client";

export const STRINGS = ["G", "D", "A", "E", "B"] as const;
export type StringName = (typeof STRINGS)[number];

const CHROMATIC = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];

export const STRING_OPEN_INDEX: Record<StringName, number> = {
    B: 11,
    E: 4,
    A: 9,
    D: 2,
    G: 7,
};

// Fret wire X positions from bass.svg path data (left→right)
const FRET_WIRES = [
    30.14, 78.14, 125.14, 172.14, 219.14, 266.14,
    313.14, 362.14, 407.14, 454.14, 501.14, 548.14, 595.14,
];

// String Y positions in SVG coords (after translate(0,11))
const STRING_Y = [12, 37, 62, 87, 112];

const FRET_COUNT = 12;
const R = 10;

// The fretboard grid path from bass.svg (6th string removed, frets trimmed to string 5)
const GRID_PATH =
    "M595.139808,0.4999542 L595.139808,101.5 M548.139808,0.4999542 L548.139808,101.5 M501.139808,0.4999542 L501.139808,101.5 M454.139808,0.4999542 L454.139808,101.5 M407.139808,0.4999542 L407.139808,101.5 M362.139806,0.4999542 L362.139806,101.5 M313.139808,0.4999542 L313.139808,101.5 M266.139808,0.4999542 L266.139808,101.5 M219.139808,0.4999542 L219.139808,101.5 M172.139808,0.4999542 L172.139808,101.5 M125.139808,0.4999542 L125.139808,101.5 M78.139808,0.4999542 L78.139808,101.5 M31.139808,101.00005 L378.092434,101.00005 L485.583273,101.00005 L533.417969,101.00005 L595.13981,101.00005 M31.139808,76.000046 L595.13981,76.000046 M31.139808,51.000046 L595.13981,51.000046 M31.139808,26.000046 L595.13981,26.000046 M31.139808,1.0000462 L595.13981,1.0000462 M30.139808,0.4999542 L30.139808,101.5";

function fretCenterX(fret: number): number {
    if (fret === 0) return 15;
    return (FRET_WIRES[fret - 1]! + FRET_WIRES[fret]!) / 2;
}

function fretWidth(fret: number): number {
    if (fret === 0) return FRET_WIRES[0]!;
    return FRET_WIRES[fret]! - FRET_WIRES[fret - 1]!;
}

export function getNoteAtFret(stringName: StringName, fret: number): string {
    return CHROMATIC[(STRING_OPEN_INDEX[stringName] + fret) % 12]!;
}

export interface FretboardFeedback {
    stringName: StringName;
    fret: number;
    correct: boolean;
}

interface BassFretboardProps {
    highlightString?: StringName;
    feedback?: FretboardFeedback | null;
    correctFrets?: number[];
    onFretClick?: (stringName: StringName, fret: number) => void;
    disabled?: boolean;
}

export function BassFretboard({
    highlightString,
    feedback,
    correctFrets,
    onFretClick,
    disabled,
}: BassFretboardProps) {
    return (
        <div className="w-full overflow-x-auto -mx-2 px-2">
            <svg
                viewBox="0 0 597 125"
                className="h-auto"
                style={{ minWidth: "597px" }}
            >
                {/* Fretboard grid from bass.svg */}
                <g transform="translate(0, 11)">
                    <path
                        d={GRID_PATH}
                        stroke="currentColor"
                        strokeWidth="0.99990845"
                        fill="none"
                    />
                </g>

                {/* String labels & interactive overlays */}
                {STRINGS.map((s, sIdx) => {
                    const y = STRING_Y[sIdx]!;
                    const isTarget = highlightString === s;
                    const isDimmed = highlightString !== undefined && !isTarget;

                    return (
                        <g key={s} opacity={isDimmed ? 0.2 : 1}>
                            {/* String label */}
                            <text
                                x={12}
                                y={y + 5}
                                textAnchor="middle"
                                fontSize="13"
                                fontWeight="bold"
                                fill="currentColor"
                            >
                                {s}
                            </text>

                            {/* Clickable fret positions (1–12) */}
                            {Array.from({ length: FRET_COUNT }, (_, i) => {
                                const fret = i + 1;
                                const cx = fretCenterX(fret);
                                const w = fretWidth(fret);

                                const isFeedbackCell =
                                    feedback?.stringName === s && feedback?.fret === fret;
                                const isCorrectCell =
                                    feedback &&
                                    !feedback.correct &&
                                    feedback.stringName === s &&
                                    correctFrets?.includes(fret);

                                let fill = "transparent";
                                let textFill = "transparent";
                                let stroke = "transparent";
                                let showLabel = false;

                                if (isFeedbackCell) {
                                    fill = feedback.correct ? "#22c55e" : "#ef4444";
                                    textFill = "#ffffff";
                                    stroke = feedback.correct ? "#16a34a" : "#dc2626";
                                    showLabel = true;
                                } else if (isCorrectCell) {
                                    fill = "#22c55e";
                                    textFill = "#ffffff";
                                    stroke = "#16a34a";
                                    showLabel = true;
                                }

                                const clickable = !disabled && onFretClick && isTarget;

                                return (
                                    <g key={`${s}-${fret}`}>
                                        {clickable && (
                                            <rect
                                                x={cx - w / 2}
                                                y={y - 12}
                                                width={w}
                                                height={25}
                                                fill="transparent"
                                                className="cursor-pointer"
                                                onClick={() => onFretClick(s, fret)}
                                            />
                                        )}
                                        {(isFeedbackCell || isCorrectCell) && (
                                            <>
                                                <circle
                                                    cx={cx}
                                                    cy={y}
                                                    r={R}
                                                    fill={fill}
                                                    stroke={stroke}
                                                    strokeWidth={1.5}
                                                    style={{ pointerEvents: "none" }}
                                                />
                                                {showLabel && (
                                                    <text
                                                        x={cx}
                                                        y={y + 4}
                                                        textAnchor="middle"
                                                        fontSize="9"
                                                        fontWeight="600"
                                                        fill={textFill}
                                                        style={{ pointerEvents: "none" }}
                                                    >
                                                        {getNoteAtFret(s, fret)}
                                                    </text>
                                                )}
                                            </>
                                        )}
                                    </g>
                                );
                            })}
                        </g>
                    );
                })}

                {/* Hover indicator for target string frets */}
                {highlightString && !disabled && onFretClick && (
                    <style>{`
            svg g rect:hover + circle.hover-ring { opacity: 1; }
          `}</style>
                )}
            </svg>
        </div>
    );
}
