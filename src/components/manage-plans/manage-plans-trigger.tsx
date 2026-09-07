"use client";

import { useState } from "react";

import { ManagePlansPanel } from "@/components/manage-plans/manage-plans-panel";
import { Button } from "@/components/ui/button";

export function ManagePlansTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="link"
        size="sm"
        onClick={() => setOpen(true)}
        className="shrink-0 px-1"
      >
        Manage plans
      </Button>

      <ManagePlansPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
