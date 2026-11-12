import type { Migration } from "./types";
import { coreIndexesMigration } from "./0001_core_indexes";
import { adminDisplayNameLimitMigration } from "./0002_admin_display_name_limit";
import { tableCapacityAndCombinationsMigration } from "./0003_table_capacity_and_combinations";
import { initialRestaurantConfigurationMigration } from "./0004_initial_restaurant_configuration";
import { reservationLocksMigration } from "./0005_reservation_locks";
import { reservationBlocksMigration } from "./0006_reservation_blocks";
import { emailOutboxMigration } from "./0007_email_outbox";
import { reservationApiAlignmentMigration } from "./0008_reservation_api_alignment";
import { cancellationAndRetentionMigration } from "./0009_cancellation_and_retention";
import { eventInquiriesMigration } from "./0010_event_inquiries";
import { menuContentMigration } from "./0011_menu-content";
import { gridFsMediaMigration } from "./0012_gridfs-media";

// Add every new migration here in ascending ID order. Migration files are immutable once applied.
export const migrations: readonly Migration[] = [coreIndexesMigration, adminDisplayNameLimitMigration, tableCapacityAndCombinationsMigration, initialRestaurantConfigurationMigration, reservationLocksMigration, reservationBlocksMigration, emailOutboxMigration, reservationApiAlignmentMigration, cancellationAndRetentionMigration, eventInquiriesMigration, menuContentMigration, gridFsMediaMigration];
