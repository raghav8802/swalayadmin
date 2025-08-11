"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { NotificationSection } from "./NotificationSection";


export default function DashboradSection() {

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <main className="flex flex-1 items-start gap-4 py-4 sm:py-0 md:gap-8 lg:grid lg:grid-cols-[1fr_300px]">
        <div className="grid gap-4 lg:col-span-2">
          {/* counts  */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4"></div>
          {/* counts  */}

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-9">
              <div className="mt-4">
                <div className="col-span-12">
                  <Card className="w-full ">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <Link
                          href={"/albums/new-release"}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="bg-[#8B5CF6] rounded-full QuickAccessItem group-hover:bg-[#7C3AED] transition-colors">
                            <i className="bi bi-plus-circle QuickAccessItemIcon text-white"></i>
                          </div>
                          <span className="text-sm text-[#8B5CF6] group-hover:text-[#7C3AED] transition-colors">
                            New Release
                          </span>
                        </Link>

                        <Link
                          href={"/albums"}
                          className=" flex flex-col items-center gap-2 group"
                        >
                          <div className="QuickAccessItem bg-[#6366F1] rounded-full group-hover:bg-[#4F46E5] transition-colors">
                            <i className="QuickAccessItemIcon bi bi-inbox text-white"></i>
                          </div>
                          <span className="text-m text-[#6366F1] group-hover:text-[#4F46E5] transition-colors">
                            Releases
                          </span>
                        </Link>

                        <Link
                          href={"/earnings"}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="QuickAccessItem bg-[#10B981] rounded-full  group-hover:bg-[#059669] transition-colors">
                            <i className="bi bi-currency-rupee QuickAccessItemIcon text-white"></i>
                          </div>
                          <span className="text-sm text-[#10B981] group-hover:text-[#059669] transition-colors">
                            Earnings
                          </span>
                        </Link>

                        <Link
                          href={"/artists"}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="bg-[#EC4899] rounded-full QuickAccessItem group-hover:bg-[#D8336D] transition-colors">
                            <i className="bi bi-people QuickAccessItemIcon text-white"></i>
                          </div>
                          <span className="text-sm text-[#EC4899] group-hover:text-[#D8336D] transition-colors">
                            Artists
                          </span>
                        </Link>

                        <Link
                          href={"support"}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="bg-[#3B82F6] rounded-full QuickAccessItem group-hover:bg-[#2563EB] transition-colors">
                            <i className="bi bi-headset QuickAccessItemIcon text-white"></i>
                          </div>
                          <span className="text-sm text-[#3B82F6] group-hover:text-[#2563EB] transition-colors">
                            Support
                          </span>
                        </Link>

                        <Link
                          href={"/labels/custom-email"}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="bg-[#F59E42] rounded-full QuickAccessItem group-hover:bg-[#F59E42]/80 transition-colors">
                            <i className="bi bi-envelope-paper-fill QuickAccessItemIcon text-white"></i>
                          </div>
                          <span className="text-sm text-[#F59E42] group-hover:text-[#F59E42]/80 transition-colors">
                            Send Custom Email
                          </span>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="col-span-3 ">
              <NotificationSection />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
