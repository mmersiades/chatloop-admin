import { TutorShifts } from '../@types/enums';
import { Tutor } from '../@types/interfaces';

export const getTutorsByShift = (
  tutors: Tutor[],
  shift: TutorShifts
): Tutor[] => {
  return tutors.filter((tutor) => tutor.shift === shift);
};
