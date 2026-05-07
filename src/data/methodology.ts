export interface MethodologySection {
  heading: string
  points: string[]
}

export interface Methodology {
  title: string
  intro: string
  sections: MethodologySection[]
  gradesHeading: string
}

export const methodology: Methodology = {
  title: 'PROTOCOL: ATTESTATION METHODOLOGY',
  intro:
    'The "Last Known Photo" of a public figure is rarely a single static frame; it is often the result of a forensic timeline reconstruction. This site uses a 5-tier verification system to categorize the reliability of each entry.',
  sections: [
    {
      heading: 'VERIFICATION LOGIC',
      points: [
        'Temporal Precision: The interval between Date of Record and Date of Death. As the interval narrows, the attestation grade increases.',
        'Series vs. Single Frame: When the last record is a documented series — a roll of film, a burst sequence, or a contact sheet — we attest to the series, not the individual frame. The displayed image is a representative frame; the precise final exposure is rarely identifiable and is not claimed here.',
        'Public vs. Private: This database tracks public records. Private, unreleased estate photos are acknowledged but not counted. "Absolute" status is granted only when the public record is provably terminal.',
      ],
    },
  ],
  gradesHeading: 'GRADE DEFINITIONS',
}
