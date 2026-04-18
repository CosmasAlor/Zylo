-- Zylo Database Export
-- Exported: 2026-04-18T19:09:36.060Z
-- Complete schema with data ready for Supabase

-- ============================================
-- CREATE TABLES
-- ============================================


DROP TABLE IF EXISTS "GalleryItem" CASCADE;
DROP TABLE IF EXISTS "MediaItem" CASCADE;
DROP TABLE IF EXISTS "BlogPost" CASCADE;
DROP TABLE IF EXISTS "ContentBlock" CASCADE;
DROP TABLE IF EXISTS "ModuleConfig" CASCADE;
DROP TABLE IF EXISTS "LogEntry" CASCADE;
DROP TABLE IF EXISTS "Appointment" CASCADE;

DROP TYPE IF EXISTS "AppointmentStatus" CASCADE;
DROP TYPE IF EXISTS "LogType" CASCADE;

CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "LogType" AS ENUM ('EVENT', 'ERROR', 'WARNING');

CREATE TABLE "Appointment" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "fullName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "service" TEXT NOT NULL,
  "preferredDate" TIMESTAMP NOT NULL,
  "preferredTime" TEXT NOT NULL,
  "notes" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "LogEntry" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "type" TEXT NOT NULL,
  "route" TEXT,
  "message" TEXT NOT NULL,
  "payload" JSONB,
  "stack" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ModuleConfig" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL UNIQUE,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ContentBlock" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "key" TEXT NOT NULL UNIQUE,
  "value" JSONB NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "BlogPost" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "content" JSONB NOT NULL,
  "excerpt" TEXT,
  "coverImage" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "MediaItem" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "url" TEXT NOT NULL,
  "filename" TEXT NOT NULL,
  "fileType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "GalleryItem" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "beforeUrl" TEXT NOT NULL,
  "afterUrl" TEXT NOT NULL,
  "caption" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INSERT DATA
-- ============================================

-- Data for Appointment (3 records)
INSERT INTO "Appointment" ("id", "fullName", "phone", "email", "service", "preferredDate", "preferredTime", "notes", "status", "createdAt", "updatedAt") VALUES
('cmo31g4vw00002sjnrcowpu1i', 'Nafisa Rahman', '+8801711000001', 'nafisa@example.com', 'General Dentistry', '"2026-04-19T22:00:00.000Z"', '10:00', 'Routine checkup and cleaning request.', 'PENDING', '"2026-04-17T13:03:37.148Z"', '"2026-04-17T13:03:37.148Z"'),
('cmo31g4vw00012sjncsoiikdv', 'Mahmud Hasan', '+8801711000002', 'mahmud@example.com', 'Dental Implants', '"2026-04-21T22:00:00.000Z"', '15:30', 'Consultation for implant options.', 'CONFIRMED', '"2026-04-17T13:03:37.148Z"', '"2026-04-17T13:03:37.148Z"'),
('cmo31g4vx00022sjnktxvftdf', 'Sadia Akter', '+8801711000003', 'sadia@example.com', 'Root Canal Therapy', '"2026-04-17T22:00:00.000Z"', '12:15', 'Follow-up from emergency pain visit.', 'COMPLETED', '"2026-04-17T13:03:37.148Z"', '"2026-04-17T13:03:37.148Z"');

-- Data for LogEntry (5 records)
INSERT INTO "LogEntry" ("id", "type", "route", "message", "payload", "stack", "createdAt") VALUES
('cmo2r7iz00000ckjndfoofbs6', 'ERROR', 'Global Router Boundary', '
Invalid `prisma.moduleConfig.findMany()` invocation:


The table `public.ModuleConfig` does not exist in the current database.', '{"digest":"2749101550"}', 'PrismaClientKnownRequestError: 
Invalid `prisma.moduleConfig.findMany()` invocation:


The table `public.ModuleConfig` does not exist in the current database.
    at  ModulesList (about://React/Server/webpack-internal:///(rsc)/./modules/admin/components/ModulesList.tsx?0:35:21)
    at resolveErrorDev (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js:3269:51)
    at processFullStringRow (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js:4436:23)
    at processFullBinaryRow (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js:4379:7)
    at processBinaryChunk (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js:4602:19)
    at progress (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js:4933:9)', '"2026-04-17T08:16:59.346Z"'),
('cmo2rvln3000120jn8gb6mw1d', 'ERROR', 'Global Router Boundary', 'useToast is not defined', '{}', 'ReferenceError: useToast is not defined
    at EditBlogPostPage (webpack-internal:///(app-pages-browser)/./app/admin/blog/edit/[id]/page.tsx:27:23)
    at Object.react_stack_bottom_frame (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:28242:20)
    at renderWithHooks (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:7926:22)
    at updateFunctionComponent (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:10443:19)
    at beginWork (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:12113:18)
    at runWithFiberInDEV (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:987:30)
    at performUnitOfWork (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:18989:22)
    at workLoopSync (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:18817:41)
    at renderRootSync (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:18798:11)
    at performWorkOnRoot (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:17903:35)
    at performWorkOnRootViaSchedulerTask (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:20472:7)
    at MessagePort.performWorkUntilDeadline (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/scheduler/cjs/scheduler.development.js:45:48)', '"2026-04-17T08:35:42.543Z"'),
('cmo2rvln3000020jn96qh9pig', 'ERROR', 'Global Router Boundary', 'useToast is not defined', '{}', 'ReferenceError: useToast is not defined
    at EditBlogPostPage (webpack-internal:///(app-pages-browser)/./app/admin/blog/edit/[id]/page.tsx:27:23)
    at Object.react_stack_bottom_frame (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:28242:20)
    at renderWithHooks (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:7926:22)
    at updateFunctionComponent (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:10443:19)
    at beginWork (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:12113:18)
    at runWithFiberInDEV (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:987:30)
    at performUnitOfWork (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:18989:22)
    at workLoopSync (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:18817:41)
    at renderRootSync (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:18798:11)
    at performWorkOnRoot (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:17903:35)
    at performWorkOnRootViaSchedulerTask (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js:20472:7)
    at MessagePort.performWorkUntilDeadline (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/scheduler/cjs/scheduler.development.js:45:48)', '"2026-04-17T08:35:42.543Z"'),
('cmo4dikm100010wjnu08sio4j', 'ERROR', 'Global Router Boundary', 'Event handlers cannot be passed to Client Component props.
  <iframe src=... className=... title=... loading=... style=... onError={function onError}>
                                                                        ^^^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.', '{"digest":"279632008"}', 'Error: Event handlers cannot be passed to Client Component props.
  <iframe src=... className=... title=... loading=... style=... onError={function onError}>
                                                                        ^^^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.
    at stringify (<anonymous>:1:18)
    at resolveErrorDev (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js:3270:29)
    at processFullStringRow (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js:4436:23)
    at processFullBinaryRow (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js:4379:7)
    at processBinaryChunk (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js:4602:19)
    at progress (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js:4933:9)', '"2026-04-18T11:29:12.410Z"'),
('cmo4dikm100020wjnolx66r0q', 'ERROR', 'Global Router Boundary', 'Event handlers cannot be passed to Client Component props.
  <iframe src=... className=... title=... loading=... style=... onError={function onError}>
                                                                        ^^^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.', '{"digest":"279632008"}', 'Error: Event handlers cannot be passed to Client Component props.
  <iframe src=... className=... title=... loading=... style=... onError={function onError}>
                                                                        ^^^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.
    at stringify (<anonymous>:1:18)
    at resolveErrorDev (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js:3270:29)
    at processFullStringRow (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js:4436:23)
    at processFullBinaryRow (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js:4379:7)
    at processBinaryChunk (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js:4602:19)
    at progress (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/compiled/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js:4933:9)', '"2026-04-18T11:29:12.410Z"');

-- Data for ContentBlock (1 records)
INSERT INTO "ContentBlock" ("id", "key", "value", "updatedAt") VALUES
('cmo31g4xs00082sjn3dwg2b43', 'testimonials', '{"badge":"Patient Experience","items":[{"name":"Amira Hassan","role":"Teacher","text":"Dr. Zahir and his team provided exceptional care during my root canal. I was terrified, but their compassion made all the difference. The facility is modern and spotlessly clean.","rating":5},{"name":"Ibrahim Osman","role":"Business Owner","text":"I''ve been coming to Zylo for three years now. The professionalism and attention to detail is unmatched. My teeth have never looked better, and I feel confident in my smile again.","rating":5},{"name":"Leila Mohamed","role":"Healthcare Professional","text":"As a medical professional myself, I appreciate the evidence-based approach Zylo takes to dental care. They explain everything clearly and never rush treatment.","rating":5},{"name":"Karim Abdurahman","role":"Student","text":"Got my braces adjusted today and the experience was painless. The staff is friendly and the environment is comfortable. Highly recommend!","rating":5},{"name":"Fatima Ali","role":"Homemaker","text":"My family has been patients here for over 5 years. The consistent quality and genuine care they show for their patients is remarkable. Thank you, Zylo!","rating":5}],"title":"Patient Stories from Juba","description":"Real experiences from families who trust Zylo for their clinical excellence and gentle care."}', '"2026-04-17T13:03:37.217Z"');

-- Data for BlogPost (3 records)
INSERT INTO "BlogPost" ("id", "slug", "title", "content", "excerpt", "coverImage", "published", "createdAt", "updatedAt") VALUES
('cmo31g4wr00032sjnjlc8uazl', 'importance-of-regular-checkups', 'The Importance of Regular Dental Checkups', '{"body":"Regular dental checkups are the cornerstone of good oral health. Many people believe they only need to visit the dentist when they''re in pain, but preventive care is far more effective and less costly in the long run.\n\nDuring a routine visit, your dentist does more than just clean your teeth. We perform a comprehensive exam of your mouth, including screening for oral cancer, checking for signs of gum disease, and identifying potential cavities before they become serious issues.\n\nProfessional cleanings reach areas that even the most diligent brushing and flossing can miss. Removing plaque and tartar prevents the buildup of bacteria that leads to tooth decay and inflammation. By visiting Zylo Dental twice a year, you''re investing in a lifetime of healthy smiles."}', 'Discover why visiting your dentist every six months is crucial for maintaining a healthy and confident smile.', 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200', true, '"2026-04-17T13:03:37.179Z"', '"2026-04-17T13:03:37.179Z"'),
('cmo31g4wr00042sjnfpdo45x1', 'modern-dental-implants', 'Modern Advances in Dental Implant Technology', '{"body":"Losing a tooth can impact more than just your appearance; it affects your ability to eat, speak, and even the health of your jawbone. Fortunately, dental implants have revolutionized how we replace missing teeth.\n\nAt Zylo Dental, we utilize 3D imaging and guided surgery techniques to ensure precise implant placement. This technology allows for faster healing times and more predictable outcomes. Unlike bridges or dentures, implants fuse directly with the bone, providing a stable foundation that feels and functions exactly like a natural tooth.\n\nWhether you''re missing a single tooth or require a full arch restoration, modern implants offer a permanent solution that can last a lifetime with proper care. Our team is dedicated to helping you find the best option for your unique situation."}', 'Learn how the latest technology is making dental implants more accessible, durable, and natural-looking than ever before.', 'https://images.unsplash.com/photo-1629851211420-bf9235d6dc6b?auto=format&fit=crop&q=80&w=1200', true, '"2026-04-17T13:03:37.179Z"', '"2026-04-17T13:03:37.179Z"'),
('cmo31g4wr00052sjnbdi4eyom', 'choosing-the-right-toothbrush', 'Choosing the Right Toothbrush for Your Needs', '{"body":"Walk down the dental care aisle of any pharmacy, and you''ll be met with dozens of toothbrush options. It can be overwhelming to decide which one is actually best for your teeth.\n\nAs a general rule, soft-bristled brushes are the safest choice for almost everyone. Hard bristles can actually wear down your tooth enamel and irritate your gums over time. The size of the brush head also matters; choose a size that allows you to comfortably reach the surfaces of your back molars.\n\nWhen it comes to electric vs. manual, both can be effective if used correctly for two full minutes. However, electric toothbrushes often make it easier to reach a high level of plaque removal, as the oscillating or sonic movements do much of the work for you. Regardless of which you choose, remember to replace your brush (or brush head) every three months."}', 'Electric or manual? Hard or soft bristles? We break down everything you need to know to choose the perfect toothbrush.', 'https://images.unsplash.com/photo-1559599141-8656f2648580?auto=format&fit=crop&q=80&w=1200', true, '"2026-04-17T13:03:37.179Z"', '"2026-04-17T13:03:37.179Z"');

-- Data for MediaItem (3 records)
INSERT INTO "MediaItem" ("id", "url", "filename", "fileType", "size", "createdAt") VALUES
('cmo31zx8z0002o8jnq5ied0i6', '/uploads/4b371454-d4d0-43ee-acc2-3034c7fd8594.png', '543391302_1126749166222165_6688073829666834838_n-removebg-preview.png', 'image/png', 29351, '"2026-04-17T13:19:00.371Z"'),
('cmo322xh10004o8jn0wsuqf5f', '/uploads/864e4078-8698-4ba2-9bfe-a1be635a4d27.jpeg', 'WhatsApp Image 2026-04-02 at 3.59.36 PM.jpeg', 'image/jpeg', 43025, '"2026-04-17T13:21:20.629Z"'),
('cmo4ca4cq00000wjnmiy44dam', '/uploads/4170525a-6a25-447b-bc58-8f6d6a0817f8.png', 'Abot-Us-4-2-min (1).png', 'image/png', 670739, '"2026-04-18T10:54:38.474Z"');

-- Data for GalleryItem (3 records)
INSERT INTO "GalleryItem" ("id", "beforeUrl", "afterUrl", "caption", "order", "createdAt") VALUES
('cmo323nyh0005o8jnphrt2otn', 'http://localhost:3000/uploads/4b371454-d4d0-43ee-acc2-3034c7fd8594.png', 'http://localhost:3000/uploads/864e4078-8698-4ba2-9bfe-a1be635a4d27.jpeg', NULL, 2, '"2026-04-17T13:21:54.953Z"'),
('cmo31g4xg00072sjnx6n199v4', '/uploads/4170525a-6a25-447b-bc58-8f6d6a0817f8.png', 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=800', 'Cosmetic Veneers', 1, '"2026-04-17T13:03:37.204Z"'),
('cmo320vm80003o8jn2abcmmwu', 'http://localhost:3000/uploads/4b371454-d4d0-43ee-acc2-3034c7fd8594.png', '/uploads/4170525a-6a25-447b-bc58-8f6d6a0817f8.png', 'testing', 2, '"2026-04-17T13:19:44.912Z"');

