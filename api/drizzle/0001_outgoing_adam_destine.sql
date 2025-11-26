CREATE INDEX "access_uuid_idx" ON "access" USING btree ("uuid");--> statement-breakpoint
CREATE INDEX "access_module_id_idx" ON "access" USING btree ("module_id");--> statement-breakpoint
CREATE UNIQUE INDEX "access_code_idx" ON "access" USING btree ("code");--> statement-breakpoint
CREATE INDEX "user_uuid_idx" ON "credentials" USING btree ("uuid");--> statement-breakpoint
CREATE UNIQUE INDEX "user_username_idx" ON "credentials" USING btree ("username");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "credentials" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "credentials_status_idx" ON "credentials" USING btree ("status");--> statement-breakpoint
CREATE INDEX "demos_table_uuid_idx" ON "demos_table" USING btree ("uuid");--> statement-breakpoint
CREATE INDEX "demos_table_name_idx" ON "demos_table" USING btree ("name");--> statement-breakpoint
CREATE INDEX "modules_uuid_idx" ON "modules" USING btree ("uuid");--> statement-breakpoint
CREATE UNIQUE INDEX "modules_name_idx" ON "modules" USING btree ("name");--> statement-breakpoint
CREATE INDEX "role_access_role_id_idx" ON "role_access" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "role_access_access_id_idx" ON "role_access" USING btree ("access_id");--> statement-breakpoint
CREATE UNIQUE INDEX "role_access_role_id_access_id_idx" ON "role_access" USING btree ("role_id","access_id");--> statement-breakpoint
CREATE INDEX "roles_uuid_idx" ON "roles" USING btree ("uuid");--> statement-breakpoint
CREATE UNIQUE INDEX "roles_name_idx" ON "roles" USING btree ("name");--> statement-breakpoint
CREATE INDEX "users_uuid_idx" ON "users" USING btree ("uuid");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");