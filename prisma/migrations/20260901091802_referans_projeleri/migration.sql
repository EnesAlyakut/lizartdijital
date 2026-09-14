-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PortfolioProject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "services" TEXT NOT NULL DEFAULT '[]',
    "technologies" TEXT NOT NULL DEFAULT '[]',
    "results" TEXT NOT NULL DEFAULT '[]',
    "coverImage" TEXT NOT NULL,
    "mobileImage" TEXT,
    "liveUrl" TEXT,
    "deliverables" TEXT NOT NULL DEFAULT '[]',
    "gallery" TEXT NOT NULL DEFAULT '[]',
    "testimonial" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_PortfolioProject" ("category", "client", "completedAt", "coverImage", "gallery", "id", "isFeatured", "problem", "results", "sector", "services", "slug", "solution", "summary", "technologies", "testimonial", "title") SELECT "category", "client", "completedAt", "coverImage", "gallery", "id", "isFeatured", "problem", "results", "sector", "services", "slug", "solution", "summary", "technologies", "testimonial", "title" FROM "PortfolioProject";
DROP TABLE "PortfolioProject";
ALTER TABLE "new_PortfolioProject" RENAME TO "PortfolioProject";
CREATE UNIQUE INDEX "PortfolioProject_slug_key" ON "PortfolioProject"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
