-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR NOT NULL,
    "name" VARCHAR,
    "password" VARCHAR NOT NULL,
    "role" VARCHAR,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_jobs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT,
    "main_keyword" TEXT,
    "tone_of_voice" TEXT,
    "audience_type" TEXT,
    "content_format" TEXT,
    "generated_text" TEXT,
    "status" TEXT DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordPressCredentials" (
    "id" SERIAL NOT NULL,
    "siteUrl" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "applicationPassword" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "WordPressCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WordPressCredentials_userId_key" ON "WordPressCredentials"("userId");

-- AddForeignKey
ALTER TABLE "content_jobs" ADD CONSTRAINT "content_jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordPressCredentials" ADD CONSTRAINT "WordPressCredentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
