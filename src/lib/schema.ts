import { pgTable, text, boolean, timestamp, serial } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role', { enum: ['manager', 'worker'] }).notNull(),
  gender: text('gender', { enum: ['male', 'female'] }),
  keepShabbat: boolean('keep_shabbat').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const shifts = pgTable('shifts', {
  id: serial('id').primaryKey(),
  date: text('date').notNull(),
  timeSlot: text('time_slot').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  station: text('station').notNull(),
  workerId: text('worker_id').notNull(),
  workerName: text('worker_name').notNull(),
  status: text('status', { enum: ['assigned', 'pending', 'completed'] }).default('assigned'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const constraints = pgTable('constraints', {
  id: serial('id').primaryKey(),
  workerId: text('worker_id').notNull(),
  date: text('date').notNull(),
  timeSlot: text('time_slot').notNull(),
  isAvailable: boolean('is_available').default(true),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
