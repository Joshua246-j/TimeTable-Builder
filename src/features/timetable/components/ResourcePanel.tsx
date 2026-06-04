"use client";

import { Search, BookOpen, GraduationCap, Building2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useResourceStore } from "@/store/resource-store";

export default function ResourcePanel() {
  const {
    activeTab,
    searchQuery,

    setActiveTab,
    setSearchQuery,
  } = useResourceStore();

  return (
    <aside
      className="
        flex
        h-full
        flex-col
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* Header */}
      <div className="border-b border-slate-200 p-5">
        <h2
          className="
            text-base
            font-semibold
            text-slate-900
          "
        >
          Academic Resources
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
          "
        >
          Manage subjects, faculty and rooms.
        </p>
      </div>

      {/* Tabs */}
      <div className="p-5 pb-0">
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(
              value as
                | "subjects"
                | "faculty"
                | "rooms"
            )
          }
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="subjects">
              Subjects
            </TabsTrigger>

            <TabsTrigger value="faculty">
              Faculty
            </TabsTrigger>

            <TabsTrigger value="rooms">
              Rooms
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search */}
      <div className="p-5">
        <div className="relative">
          <Search
            className="
              absolute
              left-3
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-slate-400
            "
          />

          <Input
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder={`Search ${activeTab}`}
            className="pl-9"
          />
        </div>
      </div>

      {/* Content */}
      <div
        className="
          flex-1
          overflow-y-auto
          px-5
          pb-5
        "
      >
        {activeTab === "subjects" && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <button
                key={item}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  p-4
                  text-left
                  transition-all
                  hover:border-blue-200
                  hover:bg-blue-50
                "
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      className="
                        text-sm
                        font-semibold
                        text-slate-900
                      "
                    >
                      Data Structures
                    </h3>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-500
                      "
                    >
                      Dr. Anil Kumar
                    </p>
                  </div>

                  <Badge
                    className="
                      bg-blue-100
                      text-blue-700
                    "
                  >
                    Theory
                  </Badge>
                </div>

                <div
                  className="
                    mt-3
                    flex
                    items-center
                    gap-2
                    text-xs
                    text-slate-500
                  "
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  4 Credits • 5 Hours/Week
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === "faculty" && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <button
                key={item}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  p-4
                  text-left
                  transition-all
                  hover:border-blue-200
                  hover:bg-blue-50
                "
              >
                <div className="flex items-start gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-slate-100
                    "
                  >
                    <GraduationCap className="h-4 w-4" />
                  </div>

                  <div>
                    <h3
                      className="
                        text-sm
                        font-semibold
                        text-slate-900
                      "
                    >
                      Dr. Anil Kumar
                    </h3>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-500
                      "
                    >
                      Professor • CSE Department
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === "rooms" && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <button
                key={item}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  p-4
                  text-left
                  transition-all
                  hover:border-blue-200
                  hover:bg-blue-50
                "
              >
                <div className="flex items-start gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-slate-100
                    "
                  >
                    <Building2 className="h-4 w-4" />
                  </div>

                  <div>
                    <h3
                      className="
                        text-sm
                        font-semibold
                        text-slate-900
                      "
                    >
                      Block A-301
                    </h3>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-500
                      "
                    >
                      Capacity: 60 Students
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}