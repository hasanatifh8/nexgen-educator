/** The mandatory orientation course. Client-safe and tiny, so access rules can import it anywhere. */
export const ORIENTATION_PROGRAM_ID = "nextgen-orientation";
export const ORIENTATION_COURSE_ID = "start-here-orientation";
export const ORIENTATION_TITLE = "Start Here: AI Made Simple & Your NextGen Journey";

/** Passed = any submitted, passing attempt of the orientation quiz. */
export const hasPassedOrientation = (attempts: { programId: string; passed?: boolean }[] | undefined) =>
  !!attempts?.some((a) => a.programId === ORIENTATION_PROGRAM_ID && a.passed);
