-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tarefas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_tarefas" ("createdAt", "descricao", "id", "status", "titulo") SELECT "createdAt", "descricao", "id", "status", "titulo" FROM "tarefas";
DROP TABLE "tarefas";
ALTER TABLE "new_tarefas" RENAME TO "tarefas";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
