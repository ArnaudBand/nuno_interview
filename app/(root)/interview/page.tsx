import {Agent} from "@/components/Agent";

const InterviewPage = () => {
    return (
        <>
            <h3>Interview Generation</h3>
            <Agent userName={"agent"} type={"generate"} />
        </>
    );
};

export default InterviewPage;
