"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser } from "@/hooks/use-current-user";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import DashboardChartSectionAdmin from "./ticket-maintenance-chart";
import DashboardCardsAdmin from "./dashboard-card";
import DashboardChartAnalistGroup from "./analist-chart-group";
import DashboardChartAnalist2 from "./analist2-chart-group";
import MqttClient from "../ioT/mqttClient";

export default function DashboardPage() {
  const user = useCurrentUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const chartVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  return (
    <ScrollArea className="h-full w-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-1xl lg:text-3xl font-bold tracking-tight "
          >
            Hi, Welcome back {user?.name} 👋
          </motion.h2>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="flex w-full overflow-x-auto whitespace-nowrap px-4 justify-start md:justify-center">
            <TabsTrigger value="overview" className="text-[10px] lg:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="analytics1" className="text-[10px]  lg:text-sm">Analytics 1</TabsTrigger>
            <TabsTrigger value="analytics2" className="text-[10px]  lg:text-sm">Analytics 2</TabsTrigger>
            <TabsTrigger value="iotMonitoring" className="text-[10px]  lg:text-sm">IoT Monitoring</TabsTrigger>
            {/* <TabsTrigger value="reports" className="text-[10px]  lg:text-sm" disabled>Reports</TabsTrigger> */}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-1"
            >
              <DashboardCardsAdmin />
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
            >
              <motion.div variants={chartVariants} className="col-span-2 lg:col-span-7">
                <DashboardChartSectionAdmin />
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Analytics 1 Tab */}
          <TabsContent value="analytics1" className="space-y-4">
            <motion.div variants={chartVariants} className="col-span-2 lg:col-span-7">
              <DashboardChartAnalistGroup />
            </motion.div>
          </TabsContent>

          {/* Analytics 2 Tab */}
          <TabsContent value="analytics2" className="space-y-4">
            <motion.div variants={chartVariants} className="col-span-2 lg:col-span-7">
              <DashboardChartAnalist2 />
            </motion.div>
          </TabsContent>

          <TabsContent value="iotMonitoring" className="space-y-4">
            <motion.div className="col-span-2 lg:col-span-7">
              <MqttClient />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
