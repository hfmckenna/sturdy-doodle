import { useMutation, useQuery } from "@apollo/client";
import { CREATE_COURSE_RESULT } from "../services/courseResult.ts";
import { GET_USERS } from "../services/user.ts";

export const CourseResultForm = ({ learnerId }: { learnerId: string }) => {
  const { refetch } = useQuery(GET_USERS);
  const [createCourse] = useMutation(CREATE_COURSE_RESULT);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const scoreRaw = String(formData.get("score") || "").trim();
    const score = Number.parseInt(scoreRaw, 10);
    if (!name || Number.isNaN(score)) return;

    await createCourse({ variables: { name, score, learnerId } });
    form.reset();
    await refetch();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginTop: 8 }}>
      <input name="name" placeholder="Course name" />
      <input name="score" placeholder="Score" type="number" min={0} max={100} />
      <button type="submit">Add Result</button>
    </form>
  );
};
