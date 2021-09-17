import { TutorShift } from '../@types/enums';
import { Tutor } from '../@types/interfaces';

export const getTutorsByShift = (
  tutors: Tutor[],
  shift: TutorShift
): Tutor[] => {
  return tutors.filter((tutor) => tutor.shift === shift);
};
