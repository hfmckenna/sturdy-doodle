import {useMutation, useQuery} from "@apollo/client";
import {CREATE_COURSE_RESULT, UPDATE_COURSE_RESULT} from "../services/courseResult.ts";
import {GET_USERS} from "../services/user.ts";
import type {CourseResult} from "../models/domain.ts";

export const CourseResultForm = ({
                                     learnerId,
                                     course,
                                     onCancel,
                                     onSubmitted,
                                 }: {
    learnerId?: string;
    course?: CourseResult;
    onCancel?: () => void;
    onSubmitted?: () => void
}) => {
    const {refetch} = useQuery(GET_USERS);
    const [createCourse] = useMutation(CREATE_COURSE_RESULT);
    const [updateCourse] = useMutation(UPDATE_COURSE_RESULT);

    const isEdit = Boolean(course?.id);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = String(formData.get("name") || "").trim();
        const scoreRaw = String(formData.get("score") || "").trim();
        const score = Number.parseInt(scoreRaw, 10);
        if (!name || Number.isNaN(score)) return;

        if (isEdit && course?.id) {
            await updateCourse({variables: {id: course.id, name, score}});
            await refetch();
            onSubmitted?.();
        } else if (learnerId) {
            await createCourse({variables: {name, score, learnerId}});
            form.reset();
            await refetch();
            onSubmitted?.();
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{display: "flex", gap: 8, marginTop: 8}}>
            <input name="name" placeholder="Course name" defaultValue={course?.name ?? ""}/>
            <input name="score" placeholder="Score" type="number" min={0} max={100}
                   defaultValue={course?.score?.toString() ?? ""}/>
            <button type="submit">{isEdit ? "Save" : "Add Result"}</button>
            {isEdit && onCancel && (
                <button type="button" onClick={onCancel}>Cancel</button>
            )}
        </form>
    );
};
