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
        'Series vs. Single Frame: For burst photography or film, "Last Photo" refers to the final frame in a documented sequence unless a specific frame is uniquely verified.',
        'Public vs. Private: This database tracks public records. Private, unreleased estate photos are acknowledged but not counted. "Absolute" status is granted only when the public record is provably terminal.',
      ],
    },
  ],
  gradesHeading: 'GRADE DEFINITIONS',
}
