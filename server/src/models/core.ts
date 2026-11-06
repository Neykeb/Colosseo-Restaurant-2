import { model, Schema, type InferSchemaType } from "mongoose";

const timestamps = true;

const settingSchema = new Schema({ key: { type: String, required: true, unique: true }, value: { type: Schema.Types.Mixed, required: true } }, { timestamps });
const serviceHoursSchema = new Schema({ weekday: { type: Number, required: true, min: 0, max: 6 }, opens: { type: String, required: true }, closes: { type: String, required: true }, enabled: { type: Boolean, required: true, default: true } }, { timestamps });
serviceHoursSchema.index({ weekday: 1 }, { unique: true });
const specialDaySchema = new Schema({ date: { type: String, required: true }, label: { type: String, required: true }, closed: { type: Boolean, required: true }, opens: String, closes: String }, { timestamps });
specialDaySchema.index({ date: 1 }, { unique: true });
const areaSchema = new Schema({ key: { type: String, required: true, unique: true }, name: { type: String, required: true }, active: { type: Boolean, required: true, default: true } }, { timestamps });
const tableSchema = new Schema({ key: { type: String, required: true, unique: true }, areaKey: { type: String, required: true }, seats: { type: Number, required: true, min: 1 }, combinable: { type: Boolean, required: true, default: false }, active: { type: Boolean, required: true, default: true }, allocationVersion: { type: Number, required: true, default: 0 } }, { timestamps });
tableSchema.index({ areaKey: 1, active: 1 });
const reservationSchema = new Schema({ publicId: { type: String, required: true, unique: true }, date: { type: String, required: true }, startTime: { type: String, required: true }, endTime: { type: String, required: true }, partySize: { type: Number, required: true, min: 1 }, status: { type: String, required: true, enum: ["requested", "confirmed", "cancelled", "declined", "completed", "no_show"] }, guest: { name: { type: String, required: true }, email: String, phone: String }, idempotencyKey: { type: String, required: true, unique: true } }, { timestamps });
reservationSchema.index({ date: 1, startTime: 1, status: 1 });
const assignmentSchema = new Schema({ reservationPublicId: { type: String, required: true }, tableKey: { type: String, required: true }, date: { type: String, required: true }, startTime: { type: String, required: true }, endTime: { type: String, required: true } }, { timestamps });
assignmentSchema.index({ reservationPublicId: 1, tableKey: 1 }, { unique: true });
assignmentSchema.index({ tableKey: 1, date: 1, startTime: 1, endTime: 1 });
const auditEventSchema = new Schema({ eventId: { type: String, required: true, unique: true }, actorId: String, action: { type: String, required: true }, target: { type: String, required: true }, metadata: { type: Schema.Types.Mixed, required: true } }, { timestamps });
const outboxEventSchema = new Schema({ eventId: { type: String, required: true, unique: true }, type: { type: String, required: true }, aggregateId: { type: String, required: true }, payload: { type: Schema.Types.Mixed, required: true }, status: { type: String, required: true, enum: ["pending", "processing", "sent", "failed"] }, attempts: { type: Number, required: true, min: 0, default: 0 }, nextAttemptAt: Date }, { timestamps });
outboxEventSchema.index({ status: 1, nextAttemptAt: 1 });
const adminProfileSchema = new Schema({ clerkUserId: { type: String, required: true, unique: true }, role: { type: String, required: true, enum: ["owner", "staff"] }, active: { type: Boolean, required: true, default: true }, displayName: { type: String, required: true }, lastAdminAccessAt: Date }, { timestamps });

export type Setting = InferSchemaType<typeof settingSchema>;
export type ServiceHours = InferSchemaType<typeof serviceHoursSchema>;
export type Reservation = InferSchemaType<typeof reservationSchema>;

export const SettingModel = model("Setting", settingSchema);
export const ServiceHoursModel = model("ServiceHours", serviceHoursSchema);
export const SpecialDayModel = model("SpecialDay", specialDaySchema);
export const AreaModel = model("Area", areaSchema);
export const TableModel = model("Table", tableSchema);
export const ReservationModel = model("Reservation", reservationSchema);
export const TableAssignmentModel = model("TableAssignment", assignmentSchema);
export const AuditEventModel = model("AuditEvent", auditEventSchema);
export const OutboxEventModel = model("OutboxEvent", outboxEventSchema);
export const AdminProfileModel = model("AdminProfile", adminProfileSchema);
