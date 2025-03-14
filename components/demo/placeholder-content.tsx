"use client";

import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrentUser } from '@/hooks/use-current-user';
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import DashboardChartSectionAdmin from './ticket-maintenance-chart';
import DashboardCardsAdmin from './dashboard-card';
import DashboardChartAnalistGroup from './analist-chart-group';
import DashboardChartAnalist2 from './analist2-chart-group';

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
            className="text-3xl font-bold tracking-tight"
          >
            Hi, Welcome back {user?.name}👋
          </motion.h2>
          <div className="hidden items-center space-x-2 md:flex">
            {/* <Button className="bg-orange-500 text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 dark:bg-orange-500 dark:hover:bg-orange-600">
              Download
            </Button> */}
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics1">
              Analytics 1
            </TabsTrigger>
            <TabsTrigger value="analytics2">
              Analytics 2
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Reports
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.2 } },
              }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-1"
            >
              <DashboardCardsAdmin />
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.2 } },
              }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
            >
              <motion.div variants={chartVariants} className="col-span-2 lg:col-span-7">
                <DashboardChartSectionAdmin />
              </motion.div>
            </motion.div>
          </TabsContent>
          <TabsContent value="analytics1" className="space-y-4">
          <motion.div variants={chartVariants} className="col-span-2 lg:col-span-7">
            <DashboardChartAnalistGroup/>
            </motion.div>
          </TabsContent>
          <TabsContent value="analytics2" className="space-y-4">
          <motion.div variants={chartVariants} className="col-span-2 lg:col-span-7">
            <DashboardChartAnalist2/>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}