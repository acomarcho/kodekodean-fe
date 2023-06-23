"use client";

import { useState, useEffect, useContext } from "react";
import { CourseContext } from "@/contexts/course-context";
import axios, { AxiosError } from "axios";
import { CourseUnit } from "@/lib/schema";
import { notification, Spin } from "antd";
import { useRouter } from "next/navigation";
import Modules from "../unit/modules";

interface CourseUnitData {
  unit: CourseUnit;
  modules: {
    count: number;
  };
}

interface CourseUnitResponse {
  data: {
    units: CourseUnitData[];
  };
}

export default function Units() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [courseUnits, setCourseUnits] = useState<CourseUnitData[]>([]);
  const course = useContext(CourseContext);

  const [api, contextHolder] = notification.useNotification();

  const router = useRouter();

  useEffect(() => {
    const fetchCourseUnits = async () => {
      setIsLoading(true);

      try {
        const response = (await axios.get(
          `/api/course/units/${course.id}`
        )) as CourseUnitResponse;
        setCourseUnits(response.data.units);

        setIsLoading(false);
      } catch (error) {
        interface ErrorResponse {
          data: {
            message: string;
          };
        }

        const err = error as AxiosError;
        let errMessage = "";
        if (err.response) {
          const errResponse = err.response as ErrorResponse;
          errMessage = errResponse.data.message;
        } else {
          errMessage = err.message;
        }
        api.error({
          message: "Gagal mengambil unit dari courses",
          description: errMessage,
          placement: "bottomRight",
        });
        setIsLoading(false);
      }
    };

    fetchCourseUnits();
  }, [api, course]);

  const handleClick = (id: number) => {
    router.push(`/course/unit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="w-[100%] flex flex-col justify-center items-center gap-[1rem] p-[1rem] lg:px-[2.5rem]">
        {contextHolder}
        <div>
          <Spin size="large" />
        </div>
        <p className="text-white font-bold text-[2rem]">Loading ...</p>
      </div>
    );
  }

  return (
    <div className="p-[1rem] grid grid-cols-1 gap-[1rem] lg:px-[2.5rem] lg:grid-cols-2">
      {contextHolder}
      {courseUnits.map(({ unit, modules }) => {
        const { id, rank, title } = unit;
        const { count } = modules;
        return (
          <div
            className="w-[100%] bg-dark-gray flex flex-col gap-[2rem] justify-between p-[1.5rem] lg:p-[2rem]"
            key={id}
          >
            {/* Course information */}
            <div className="flex flex-col gap-[1rem]">
              <h1 className="text-white font-bold text-[1.25rem] lg:text-[1.75rem]">
                Unit {rank}
              </h1>
              <p className="text-light-gray text-[1rem] lg:text-[1.25rem]">
                {title}
              </p>
              <p className="text-yellow text-[1rem] lg:text-[1.25rem]">
                0/{count} modul sudah Anda selesaikan
              </p>
              {/* <p
                className={`${
                  finishedCount === moduleCount ? "text-green" : "text-yellow"
                } text-[1rem] lg:text-[1.25rem]`}
              >
                {finishedCount}/{moduleCount} modul sudah Anda selesaikan
              </p> */}
            </div>
            {/* Button */}
            <button
              className="text-white border-2 border-white p-[1rem] font-bold transition-all hover:pointer hover:text-black hover:bg-white text-[1rem] lg:text-[1.25rem]"
              onClick={() => handleClick(id)}
            >
              Eksplorasi
            </button>
          </div>
        );
      })}
    </div>
  );
}
