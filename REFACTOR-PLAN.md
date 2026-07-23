# Full Refactor Plan: UI Component Library + File Reorganization

## 1. New Directory Structure

```
components/
  ui/
    index.ts              -- barrel re-export (preserves all existing import paths)
    Button.tsx            -- Button + LinkButton (all variants)
    SocialButton.tsx      -- circular social login buttons
    TextInput.tsx         -- TextInput + TextArea + SearchInput
    FormField.tsx         -- label + input wrapper
    FormError.tsx         -- error message
    Avatar.tsx            -- avatar with size variants
    Divider.tsx           -- divider (consolidated)
    Tag.tsx               -- tag/chip (static + dismissible)
    Checkbox.tsx          -- styled checkbox
    Logo.tsx              -- circle + "LOGO" text
    EmptyState.tsx        -- centered "coming soon" + inline "no items"
    SectionTitle.tsx      -- section headers
    Stat.tsx              -- icon + number
    FilterPill.tsx        -- category pill + toggle button
    HiddenFileUpload.tsx  -- hidden file input
    OrDivider.tsx         -- "or continue with" divider
    Spinner.tsx           -- (moved from ui.tsx)
    ErrorMessage.tsx      -- (moved from ui.tsx)
    ProtectedRoute.tsx    -- (moved from ui.tsx)
  layout/
    AuthPageLayout.tsx        -- Split-screen auth layout
    ProjectCreationHeader.tsx -- Back nav + save draft header
    ProjectCreationFooter.tsx -- Continue button area
    ProfileProjectCard.tsx    -- Square project card with hover overlay
  Sidebar.tsx             -- stays (layout component)
  TabBar.tsx              -- stays (layout component)
  ProfileSidebar.tsx      -- stays (page-specific composite)
  AuthorPanel.tsx         -- stays (page-specific composite)
  ProjectPreview.tsx      -- stays (page-specific composite)
  SearchFilterPanel.tsx   -- stays (page-specific composite)
  ProjectForm.tsx         -- stays (page-specific form)
  LoginForm.tsx           -- stays (page-specific form)
  RegisterForm.tsx        -- stays (page-specific form)
  BackLink.tsx            -- stays (layout helper)
```

**Deleted:** `ui.tsx` (replaced by `ui/` directory), `ProfileForm.tsx` (orphaned -- zero imports anywhere)

**Key insight:** `components/ui/index.ts` barrel export means all existing `import { Spinner } from "../components/ui"` paths continue working with zero changes to consumers.

---

## 2. Component Inventory -- APIs and Patterns Replaced

### 2.1 `Button.tsx` -- Replaces 14+ button patterns

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'primary-dark' | 'purple' | 'outline' | 'outline-purple'
          | 'danger' | 'danger-text' | 'chip' | 'sidebar' | 'sidebar-light';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
}

interface LinkButtonProps {
  to: string;
  variant?: 'primary' | 'outline' | 'primary-dark';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}
```

**Patterns replaced:**
- `LoginForm:82`, `RegisterForm:82`, `InterestsPage:149`, `ProjectForm:238` -> `variant="primary"`
- `ProjectUploadPage:134`, `ProjectAssetsPage:111` -> `variant="purple"`
- `ProjectUploadPage:66`, `ProjectAssetsPage:35` -> `variant="outline-purple"`
- `ProjectDetailPage:463` -> `variant="danger"`
- `ProjectDetailPage:426` -> `variant="danger-text"`
- `ProfileEditPage:108`, `ProfileEditPage:274`, `ProfileEditPage:301` -> `variant="primary"`
- `ProfileForm:84`, `ProfileForm:102` -> `variant="primary"` size="sm"
- `ProjectDetailPage` chip buttons -> `variant="chip"`
- `ProfilePage:55,61`, `PublicProfilePage:93,103` -> `variant="sidebar"` / `variant="sidebar-light"`
- `WelcomePage:47,57`, `VerifyPage:64,82,88`, `ProjectPublishedPage:31,39` -> `LinkButton`

### 2.2 `SocialButton.tsx` -- Replaces 6 circular social buttons

```tsx
interface SocialButtonProps {
  provider: 'google' | 'facebook' | 'apple';
  onClick?: () => void;
}
```

**Patterns replaced:** `LoginPage:58` (3 buttons), `RegisterPage:58` (3 buttons)

### 2.3 `TextInput.tsx` -- Replaces 5 input class definitions + 3 search inputs + 3 textareas

```tsx
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'auth-dark' | 'auth' | 'edit' | 'project';
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'edit' | 'project';
}

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}
```

**Patterns replaced:**
- `LoginForm:41`, `RegisterForm:43` -> `variant="auth-dark"` / `variant="auth"`
- `ProfileEditPage:87` (reused ~10 times via `inputClass`) -> `variant="edit"`
- `ProjectForm:81` -> `variant="project"`
- `HomePage:87`, `SearchFilterPanel:66`, `CategoryPicker:74` -> `<SearchInput>`
- `ProjectForm:214`, `ProfileEditPage:203`, `ProjectDetailPage:383` -> `<TextArea>`

### 2.4 `FormField.tsx` -- Replaces ~20 label+input groups

```tsx
interface FormFieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}
```

**Patterns replaced:** All `<div className="flex flex-col gap-1"><label>...<input>` groups across `LoginForm`, `RegisterForm`, `ProfileForm`, `ProfileEditPage`, `ProjectForm`

### 2.5 `FormError.tsx` -- Replaces 8 error message patterns

```tsx
interface FormErrorProps {
  message: string;
  className?: string;
}
```

**Patterns replaced:** `LoginForm:79`, `RegisterForm:79`, `ProfileForm:118`, `ProfileEditPage:103`, `ProjectDetailPage:300`, `ProjectForm:232`, `ProjectUploadPage:127`, `ProjectAssetsPage:104`

### 2.6 `Avatar.tsx` -- Replaces 7 avatar patterns

```tsx
interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number; // 40 | 46 | 64 | 112 | 137 | 144
  className?: string;
}
```

**Patterns replaced:** `ProfileSidebar:35`, `ProfileEditPage:149`, `AuthorPanel:46`, `HomePage:167`, `ProjectDetailPage:376,405`, `ProfileSidebar:120` (team)

### 2.7 `Divider.tsx` -- Consolidates 23 divider instances

```tsx
interface DividerProps {
  variant?: 'default' | 'dark' | 'thin' | 'filter';
  className?: string;
}
```

**Patterns replaced:** All 17 inline dividers + 6 existing `<Divider>` uses across 7 files

### 2.8 `Tag.tsx` -- Replaces 4 tag/chip patterns

```tsx
interface TagProps {
  label: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}
```

**Patterns replaced:** `TagInput:78`, `ProjectForm:176`, `ProjectDetailPage:309,326`

### 2.9 `Checkbox.tsx` -- Replaces 5 checkbox patterns

```tsx
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  variant?: 'dark' | 'purple';
}
```

**Patterns replaced:** `LoginForm:68`, `RegisterForm:46`, `CategoryPicker:99,131`, `ProjectForm:226`

### 2.10 `Logo.tsx` -- Replaces 4 logo patterns

```tsx
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Patterns replaced:** `WelcomePage:16-17`, `VerifyPage:43-44`, `InterestsPage:82-83`, `Sidebar:45-46`

### 2.11 `EmptyState.tsx` -- Replaces 7 empty state patterns

```tsx
interface EmptyStateProps {
  message: string;
  variant?: 'centered' | 'inline';
  className?: string;
}
```

**Patterns replaced:** `ProfilePage:136`, `PublicProfilePage:154` (centered), `ProfileSidebar:106`, `AuthorPanel:102`, `ProjectDetailPage:315,332,396` (inline)

### 2.12 `SectionTitle.tsx` -- Replaces 10+ section headers

```tsx
interface SectionTitleProps {
  children: ReactNode;
  variant?: 'default' | 'uppercase' | 'subtitle';
  className?: string;
}
```

**Patterns replaced:** All `text-base text-black font-normal` headers across `ProfileSidebar`, `ProfileEditPage`, `HomePage`

### 2.13 `Stat.tsx` -- Replaces 4 stat display patterns

```tsx
interface StatProps {
  icon: LucideIcon;
  value: number;
  className?: string;
}
```

**Patterns replaced:** `HomePage:181-190`, `ProfilePage:122-125`, `PublicProfilePage:141-144`, `ProjectDetailPage:357-362`

### 2.14 `FilterPill.tsx` -- Replaces 6 category pills + 32 toggle buttons

```tsx
interface FilterPillProps {
  selected?: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

interface ToggleButtonProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}
```

**Patterns replaced:** `HomePage:119-123` (6 category pills), `InterestsPage:128-131` (32 toggles)

### 2.15 `HiddenFileUpload.tsx` -- Replaces 3 hidden file inputs

```tsx
interface HiddenFileUploadProps {
  accept?: string;
  multiple?: boolean;
  onChange: (files: FileList) => void;
  children: ReactNode;
}
```

**Patterns replaced:** `ProjectForm:109-117`, `ProjectUploadPage:113-122`, `ProjectAssetsPage:86-101`

### 2.16 `OrDivider.tsx` -- Replaces 2 "or continue with" dividers

```tsx
interface OrDividerProps {
  className?: string;
}
```

**Patterns replaced:** `LoginPage:49-51`, `RegisterPage:46-50`

### 2.17 Layout Components

**`AuthPageLayout.tsx`** -- Replaces 2 split-screen auth layouts
```tsx
interface AuthPageLayoutProps {
  visualPanel: ReactNode;
  formPanel: ReactNode;
}
```
**Patterns replaced:** `LoginPage:20-24+31-32`, `RegisterPage:14-19+27-28`

**`ProjectCreationHeader.tsx`** -- Replaces 2 identical headers
```tsx
interface ProjectCreationHeaderProps {
  backTo: string;
}
```
**Patterns replaced:** `ProjectUploadPage:55-70`, `ProjectAssetsPage:24-39`

**`ProjectCreationFooter.tsx`** -- Replaces 2 identical footers
```tsx
interface ProjectCreationFooterProps {
  disabled?: boolean;
  onClick?: () => void;
  label?: string;
}
```
**Patterns replaced:** `ProjectUploadPage:130-139`, `ProjectAssetsPage:107-116`

**`ProfileProjectCard.tsx`** -- Replaces 2 identical project cards
```tsx
interface ProfileProjectCardProps {
  project: IProject;
  showAuthor?: boolean;
  author?: IUser;
  linkTo: string;
}
```
**Patterns replaced:** `ProfilePage:109-129`, `PublicProfilePage:131-148`

---

## 3. Implementation Order

### Phase 1: Create primitives (no dependency on other new components)
1. `Spinner.tsx`, `ErrorMessage.tsx`, `ProtectedRoute.tsx` -- move from `ui.tsx`
2. `Divider.tsx` -- consolidate
3. `Avatar.tsx`
4. `Button.tsx` -- all variants
5. `TextInput.tsx` -- all input variants + SearchInput + TextArea
6. `Checkbox.tsx`
7. `Tag.tsx`
8. `Logo.tsx`
9. `SectionTitle.tsx`
10. `FormError.tsx`
11. `Stat.tsx`
12. `FilterPill.tsx`
13. `HiddenFileUpload.tsx`
14. `OrDivider.tsx`
15. `EmptyState.tsx`
16. `SocialButton.tsx`
17. `FormField.tsx` (depends on TextInput)
18. `LinkButton` (in Button.tsx, depends on nothing)

### Phase 2: Create layout components (depend on primitives)
19. `AuthPageLayout.tsx`
20. `ProjectCreationHeader.tsx`
21. `ProjectCreationFooter.tsx`
22. `ProfileProjectCard.tsx`

### Phase 3: Write barrel export
23. `components/ui/index.ts` -- re-exports everything

### Phase 4: Delete `ui.tsx`, delete `ProfileForm.tsx`

### Phase 5: Update consuming files (18 files)
- `App.tsx` -- no import changes needed (barrel preserves path)
- `LoginForm.tsx` -- replace inline classes with Button, TextInput, FormField, FormError, SocialButton, OrDivider, Logo, Checkbox
- `RegisterForm.tsx` -- same as LoginForm
- `ProfileEditPage.tsx` -- replace inputClass, button classes, Divider, FormField, FormError
- `ProfilePage.tsx` -- replace ProfileProjectCard, Stat, EmptyState
- `PublicProfilePage.tsx` -- replace ProfileProjectCard, Stat, EmptyState
- `HomePage.tsx` -- replace FilterPill, Stat
- `ProjectDetailPage.tsx` -- replace chip buttons, Tag, Avatar, FormError, Stat, EmptyState, Divider
- `ProjectUploadPage.tsx` -- replace ProjectCreationHeader, ProjectCreationFooter, Button, HiddenFileUpload
- `ProjectAssetsPage.tsx` -- same as ProjectUploadPage
- `InterestsPage.tsx` -- replace ToggleButton, Button, Logo
- `WelcomePage.tsx` -- replace LinkButton, Logo
- `VerifyPage.tsx` -- replace LinkButton, Logo
- `ProjectPublishedPage.tsx` -- replace LinkButton
- `Sidebar.tsx` -- replace Logo
- `ProjectForm.tsx` -- replace TextInput, TextArea, Tag, Checkbox, Button, FormField, HiddenFileUpload
- `TagInput.tsx` -- replace Tag
- `CategoryPicker.tsx` -- replace SearchInput, Checkbox
- `SearchFilterPanel.tsx` -- replace SearchInput, Divider

---

## 4. Files Changed Summary

| Category | Count | Files |
|----------|-------|-------|
| **New component files** | 24 | 20 in `components/ui/` + 4 in `components/layout/` |
| **Barrel export** | 1 | `components/ui/index.ts` |
| **Deleted** | 2 | `ui.tsx`, `ProfileForm.tsx` |
| **Updated** | 18 | All files listed in Phase 5 |
| **Total touched** | 45 | -- |

No backend changes needed. No import path changes for consumers of `components/ui` (barrel handles it).

---

## 5. Button Variant Style Reference

| Variant | bg | text | border | rounded | height | hover |
|---------|----|----|--------|---------|--------|-------|
| `primary` | `#b3b3b3` | black | none | none | h-[45px] | brightness-95 |
| `primary-dark` | `#525252` | white | none | none | h-[45px] | brightness-95 |
| `purple` | `#6146ea` | white | none | rounded-[30px] | h-[45px] | brightness-110 |
| `outline` | transparent | black | border-[#575656] | none | h-[45px] | bg-gray-50 |
| `outline-purple` | transparent | `#6146ea` | border-[#6146ea] | rounded-[30px] | h-[45px] | bg-[#6146ea]/5 |
| `danger` | red-100 | red-700 | none | none | h-8 | bg-red-200 |
| `danger-text` | transparent | red-700 | none | none | auto | text-red-900 |
| `chip` | `#e8e5e5` | black | none | none | h-7 | bg-[#d8d5d5] |
| `sidebar` | stone-300 | black | none | none | h-10 | brightness-95 |
| `sidebar-light` | gray-200 | black | none | none | h-10 | brightness-95 |

## 6. Size Reference

| Size | Height | Text | Padding |
|------|--------|------|---------|
| `sm` | h-7 | text-xs | px-3 |
| `md` | h-10 | text-sm | px-6 |
| `lg` | h-[45px] | text-base | px-[15px] |

## 7. TextInput Variant Style Reference

| Variant | border | text color | height | px |
|---------|--------|-----------|--------|-----|
| `auth-dark` | `#575656` | `#575656` | h-[45px] | px-[15px] |
| `auth` | `#525252` | `#525252` | h-[44px] | px-[14px] |
| `edit` | `#676767` | black | h-10 | px-2.5 |
| `project` | `#a2a0a0` | black | h-11 | px-2.5 |
