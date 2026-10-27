import { SystemRole } from "@/types/user.types";
import { enumOptions } from "./formatter";

export const assignableRoleOptions = (currentUserRole: SystemRole) =>
  enumOptions(SystemRole).map((option) => ({
    ...option,
    disabled:
      currentUserRole !== SystemRole.SUPERADMIN &&
      option.value !== SystemRole.USER,
  }));
