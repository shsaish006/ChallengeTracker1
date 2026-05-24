import { pgTable, text, varchar, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const challenges = pgTable('challenges', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 255 }).notNull(),
  track: varchar('track', { length: 255 }).notNull(),
  status: varchar('status', { length: 255 }).default('draft').notNull(),
  phases: jsonb('phases'),
  prizes: jsonb('prizes'),
  tags: jsonb('tags'),
  skills: jsonb('skills'),
  startDate: timestamp('startDate', { withTimezone: true }),
  endDate: timestamp('endDate', { withTimezone: true }),
  registrationStartDate: timestamp('registrationStartDate', { withTimezone: true }),
  registrationEndDate: timestamp('registrationEndDate', { withTimezone: true }),
  submissionStartDate: timestamp('submissionStartDate', { withTimezone: true }),
  submissionEndDate: timestamp('submissionEndDate', { withTimezone: true }),
  challengeSource: varchar('challengeSource', { length: 255 }),
  createdBy: varchar('createdBy', { length: 255 }).notNull(),
  updatedBy: varchar('updatedBy', { length: 255 }),
  legacy: jsonb('legacy'),
  timelineTemplateId: varchar('timelineTemplateId', { length: 255 }),
  groups: jsonb('groups'),
  gitRepoURL: varchar('gitRepoURL', { length: 255 }),
  forumId: varchar('forumId', { length: 255 }),
  directProjectId: varchar('directProjectId', { length: 255 }),
  billingAccountId: varchar('billingAccountId', { length: 255 }),
  overview: text('overview'),
  reviewType: varchar('reviewType', { length: 255 }),
  created: timestamp('created', { withTimezone: true }).defaultNow().notNull(),
  updated: timestamp('updated', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
});

export const challengeTypes = pgTable('challenge_types', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  description: text('description'),
  isActive: boolean('isActive').default(true).notNull(),
  created: timestamp('created', { withTimezone: true }).defaultNow().notNull(),
  updated: timestamp('updated', { withTimezone: true }).defaultNow().notNull(),
});

export const challengeTracks = pgTable('challenge_tracks', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  description: text('description'),
  isActive: boolean('isActive').default(true).notNull(),
  created: timestamp('created', { withTimezone: true }).defaultNow().notNull(),
  updated: timestamp('updated', { withTimezone: true }).defaultNow().notNull(),
});
