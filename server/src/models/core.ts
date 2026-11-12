import { model, Schema, type InferSchemaType } from "mongoose";

const timestamps = true;

const settingSchema = new Schema({ key: { type: String, required: true, unique: true }, value: { type: Schema.Types.Mixed, required: true } }, { timestamps });
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const servicePeriodSchema = new Schema({
  key: { type: String, required: true, unique: true, trim: true },
  weekday: { type: Number, required: true, min: 0, max: 6 },
  startTime: { type: String, required: true, match: timePattern },
  endTime: { type: String, required: true, match: timePattern },
  active: { type: Boolean, required: true, default: true },
}, { timestamps, collection: "servicehours" });
servicePeriodSchema.pre("validate", function validateTimeRange() {
  if (this.startTime >= this.endTime) this.invalidate("endTime", "endTime must be later than startTime");
});
servicePeriodSchema.index({ weekday: 1, startTime: 1, active: 1 });
const specialDaySchema = new Schema({ date: { type: String, required: true }, label: { type: String, required: true }, closed: { type: Boolean, required: true }, opens: String, closes: String }, { timestamps });
specialDaySchema.index({ date: 1 }, { unique: true });
const areaSchema = new Schema({ key: { type: String, required: true, unique: true }, name: { type: String, required: true }, active: { type: Boolean, required: true, default: true } }, { timestamps });
const tableSchema = new Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  areaKey: { type: String, required: true },
  minPartySize: { type: Number, required: true, min: 1 },
  maxPartySize: { type: Number, required: true, min: 1 },
  combinationGroupKey: { type: String, trim: true, default: null },
  active: { type: Boolean, required: true, default: true },
}, { timestamps });
tableSchema.pre("validate", function validateCapacity() {
  if (this.minPartySize > this.maxPartySize) this.invalidate("maxPartySize", "maxPartySize must be greater than or equal to minPartySize");
});
tableSchema.index({ areaKey: 1, active: 1 });
tableSchema.index({ combinationGroupKey: 1, active: 1 });
const reservationSchema = new Schema({ publicId: { type: String, required: true, unique: true }, date: { type: String, required: true }, startTime: { type: String, required: true }, endTime: { type: String, required: true }, partySize: { type: Number, required: true, min: 1 }, locale: { type: String, required: true, enum: ["de", "en", "it"], default: "de" }, status: { type: String, required: true, enum: ["requested", "pending", "confirmed", "cancelled", "declined", "seated", "completed", "no_show"] }, source: { type: String, required: true, enum: ["public", "admin"], default: "public" }, guest: { name: { type: String, required: true }, email: String, phone: String }, privacyAcknowledgedAt: Date, internalNote: String, cancellationTokenHash: { type: String, select: false }, idempotencyKey: { type: String, required: true, unique: true } }, { timestamps });
reservationSchema.index({ date: 1, startTime: 1, status: 1 });
reservationSchema.index({ publicId: 1, cancellationTokenHash: 1 }, { sparse: true });
const assignmentSchema = new Schema({ reservationPublicId: { type: String, required: true }, tableKey: { type: String, required: true }, date: { type: String, required: true }, startTime: { type: String, required: true }, endTime: { type: String, required: true } }, { timestamps });
assignmentSchema.index({ reservationPublicId: 1, tableKey: 1 }, { unique: true });
assignmentSchema.index({ tableKey: 1, date: 1, startTime: 1, endTime: 1 });
const reservationLockSchema = new Schema({
  reservationPublicId: { type: String, required: true },
  date: { type: String, required: true },
  tableKey: { type: String, required: true },
  slotStart: { type: String, required: true },
}, { timestamps });
reservationLockSchema.index({ date: 1, tableKey: 1, slotStart: 1 }, { unique: true, name: "unique_table_slot" });
reservationLockSchema.index({ reservationPublicId: 1 });
const reservationBlockSchema = new Schema({
  blockId: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true, match: timePattern },
  endTime: { type: String, required: true, match: timePattern },
  scope: { type: String, enum: ["restaurant", "area", "table"], default: "restaurant" },
  scopeKey: { type: String, trim: true, default: null },
  reason: { type: String, trim: true, maxlength: 240 },
  label: { type: String, trim: true, maxlength: 240 },
  active: { type: Boolean, required: true, default: true },
  createdBy: { type: String, required: true },
}, { timestamps });
reservationBlockSchema.pre("validate", function validateBlock() {
  if (this.startTime >= this.endTime) this.invalidate("endTime", "endTime must be later than startTime");
  if (this.scope !== "restaurant" && !this.scopeKey) this.invalidate("scopeKey", "scopeKey is required for an area or table block");
  if (!this.reason && !this.label) this.invalidate("reason", "reason or label is required");
});
reservationBlockSchema.index({ date: 1, startTime: 1, endTime: 1 });
reservationBlockSchema.index({ date: 1, active: 1, startTime: 1, endTime: 1 });
const auditEventSchema = new Schema({ eventId: { type: String, required: true, unique: true }, actorId: String, action: { type: String, required: true }, target: { type: String, required: true }, metadata: { type: Schema.Types.Mixed, required: true } }, { timestamps });
const outboxEventSchema = new Schema({ eventId: { type: String, required: true, unique: true }, type: { type: String, required: true }, aggregateId: { type: String, required: true }, payload: { type: Schema.Types.Mixed, required: true }, status: { type: String, required: true, enum: ["pending", "processing", "sent", "failed"] }, attempts: { type: Number, required: true, min: 0, default: 0 }, nextAttemptAt: Date, lockedAt: Date, sentAt: Date, providerId: String, lastError: { type: String, maxlength: 500 } }, { timestamps });
outboxEventSchema.index({ status: 1, nextAttemptAt: 1 });
export const ADMIN_DISPLAY_NAME_MAX_LENGTH = 120;

const adminProfileSchema = new Schema({ clerkUserId: { type: String, required: true, unique: true }, role: { type: String, required: true, enum: ["owner", "staff"] }, active: { type: Boolean, required: true, default: true }, displayName: { type: String, required: true, trim: true, maxlength: ADMIN_DISPLAY_NAME_MAX_LENGTH }, lastAdminAccessAt: Date }, { timestamps });
const eventInquirySchema = new Schema({ inquiryId: { type: String, required: true, unique: true }, name: { type: String, required: true }, email: { type: String, required: true }, phone: String, eventType: { type: String, required: true }, requestedDate: { type: String, required: true }, partySize: { type: Number, required: true, min: 1 }, message: { type: String, required: true }, status: { type: String, required: true, enum: ["new", "in_review", "accepted", "declined", "closed"], default: "new" }, internalNote: String }, { timestamps });
eventInquirySchema.index({ status: 1, requestedDate: 1 });
eventInquirySchema.index({ email: 1 });

export type Setting = InferSchemaType<typeof settingSchema>;
export type ServicePeriod = InferSchemaType<typeof servicePeriodSchema>;
export type Reservation = InferSchemaType<typeof reservationSchema>;

export const SettingModel = model("Setting", settingSchema);
export const ServicePeriodModel = model("ServicePeriod", servicePeriodSchema);
export const ServiceHoursModel = ServicePeriodModel;
export const SpecialDayModel = model("SpecialDay", specialDaySchema);
export const AreaModel = model("Area", areaSchema);
export const TableModel = model("Table", tableSchema);
export const ReservationModel = model("Reservation", reservationSchema);
export const TableAssignmentModel = model("TableAssignment", assignmentSchema);
export const ReservationLockModel = model("ReservationLock", reservationLockSchema);
export const ReservationBlockModel = model("ReservationBlock", reservationBlockSchema);
export const AuditEventModel = model("AuditEvent", auditEventSchema);
export const OutboxEventModel = model("OutboxEvent", outboxEventSchema);
export const AdminProfileModel = model("AdminProfile", adminProfileSchema);
export const EventInquiryModel = model("EventInquiry", eventInquirySchema);
