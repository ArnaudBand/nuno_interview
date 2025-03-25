import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { dummyInterviews, Interview } from "../../constants/index";
import InterviewCard from "@/components/InterviewCard";

const Home = () => {
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="font-bold">
            Get Interview-Ready with AI-Powered Practice & Feedback
          </h2>
          <p className="text-gray-600 text-lg">
            Practise on Real Interview Question & Get Instant FeedBack.
          </p>
          <Button className="btn-primary max-sm:w-full">
            <Link href={`/interviews`} className="">
              Start An Interview
            </Link>
          </Button>
        </div>
        <Image
          src={"/robot.png"}
          alt="robot"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>
      <section className="flex flex-col gap-6 mt-6">
        <h2 className="font-bold">Your Interview</h2>
        <div className="interviews-sections">
          {dummyInterviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-x-4 space-y-4">
              {dummyInterviews.map((interview: Interview) => (
                <InterviewCard key={interview.id} {...interview} />
              ))}
            </div>
          ) : (
            <p>You haven`t started any interviews yet.</p>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-6">
        <h2 className="font-bold">Recent Interviews</h2>
        <div className="interviews-sections">
          {dummyInterviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-x-4 space-y-4">
              {dummyInterviews.map((interview: Interview) => (
                <InterviewCard {...interview} key={interview.id} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-lg">
              You haven&lsquo;t started any interviews yet.
            </p>
          )}
        </div>
      </section>
      <footer className="footer">
        <p className="text-center text-gray-500">
          © 2023 NunoWise. All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default Home;
