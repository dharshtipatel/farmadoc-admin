# DataTable Component - Reusable Usage Guide

## Overview
The `DataTable` component (`app/components/DataTable.tsx`) is a fully reusable, generic table component that handles:
- ✅ Sorting (on any column marked as sortable)
- ✅ Searching/Filtering
- ✅ Pagination with custom page size
- ✅ Row selection with checkboxes
- ✅ Bulk actions
- ✅ Custom cell rendering
- ✅ Row-level actions

## Basic Usage

### 1. Import the Component
```tsx
import DataTable, { Column } from "@/app/components/DataTable";
```

### 2. Define Your Data Type
```tsx
interface User {
  id: number;
  name: string;
  email: string;
  status: "Active" | "Inactive";
  joinedDate: string;
}
```

### 3. Define Columns Configuration
```tsx
const columns: Column<User>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    render: (value) => <p className="font-medium">{value}</p>,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
    render: (value) => <a href={`mailto:${value}`}>{value}</a>,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value) => (
      <span className={value === "Active" ? "text-green-600" : "text-red-600"}>
        {value}
      </span>
    ),
  },
  {
    key: "joinedDate",
    label: "Joined",
    sortable: true,
  },
];
```

### 4. Use the Component
```tsx
import { useState } from "react";

export default function UsersPage() {
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  return (
    <div>
      <h1>Users Management</h1>
      
      <DataTable<User>
        columns={columns}
        data={usersData} // Your array of users
        rowKey={(user) => user.id}
        searchFields={["name", "email"]}
        searchPlaceholder="Search users..."
        renderRowActions={(user) => (
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              ⋮
            </button>
            {openMenu === user.id && (
              <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg py-1.5">
                <button
                  onClick={() => {
                    setOpenMenu(null);
                    // Handle edit
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setOpenMenu(null);
                    // Handle delete
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
        customFilter={(user, query) => {
          const q = query.toLowerCase();
          return (
            user.name.toLowerCase().includes(q) ||
            user.email.toLowerCase().includes(q)
          );
        }}
      />
    </div>
  );
}
```

## Column Configuration

### Column Interface
```tsx
interface Column<T> {
  key: string;              // Data key (must match T property)
  label: string;            // Column header label
  sortable?: boolean;       // Enable sorting on this column
  render?: (value, row) => ReactNode;  // Custom cell renderer
  width?: string;           // Optional CSS width
}
```

### Column Examples

**Simple Column (no custom rendering)**
```tsx
{
  key: "status",
  label: "Status",
  sortable: true,
}
```

**Column with Custom Rendering**
```tsx
{
  key: "status",
  label: "Status",
  sortable: true,
  render: (value: string) => (
    <span style={{
      color: value === "Active" ? "#24A148" : "#DA1E28"
    }}>
      {value}
    </span>
  ),
}
```

**Column with Row Data Access**
```tsx
{
  key: "profile",
  label: "Profile",
  render: (_, user) => (
    <div className="flex items-center gap-2">
      <img src={user.avatar} alt={user.name} />
      <p>{user.name}</p>
    </div>
  ),
}
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `Column<T>[]` | Required | Array of column configurations |
| `data` | `T[]` | Required | Array of data items |
| `rowKey` | `(row: T) => string \| number` | Required | Function to get unique key for each row |
| `searchFields` | `(keyof T)[]` | `[]` | Fields to search on |
| `searchPlaceholder` | `string` | "Search here..." | Placeholder for search input |
| `onSearch` | `(query: string) => void` | - | Callback when search changes |
| `renderRowActions` | `(row: T) => ReactNode` | - | Render action buttons/menus |
| `onBulkAction` | `(action: string, ids: any[]) => void` | - | Handle bulk actions |
| `bulkActions` | `BulkAction[]` | `[]` | Array of bulk action definitions |
| `renderBulkActionBar` | `(count: number, onClear) => ReactNode` | - | Custom bulk action bar |
| `pageSize` | `number` | 12 | Items per page |
| `showCheckboxes` | `boolean` | true | Show row selection checkboxes |
| `headerBackground` | `string` | "#F0F6FF" | Header background color |
| `onRowClick` | `(row: T) => void` | - | Handle row clicks |
| `customFilter` | `(row: T, query: string) => boolean` | - | Custom filter function |

## Advanced Examples

### With Bulk Actions
```tsx
<DataTable<Seller>
  columns={columns}
  data={sellers}
  rowKey={(seller) => seller.id}
  bulkActions={[
    { label: "Upgrade", value: "upgrade" },
    { label: "Suspend", value: "suspend", color: "text-red-600" },
  ]}
  onBulkAction={(action, selectedIds) => {
    console.log(`Performing ${action} on:`, selectedIds);
    // Handle bulk action
  }}
/>
```

### With Custom Filter
```tsx
<DataTable<Product>
  columns={columns}
  data={products}
  rowKey={(product) => product.id}
  customFilter={(product, query) => {
    const q = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(q) ||
      product.sku.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q)
    );
  }}
/>
```

### With Custom Page Size
```tsx
<DataTable<Item>
  columns={columns}
  data={items}
  rowKey={(item) => item.id}
  pageSize={25}  // Show 25 items per page by default
/>
```

## Current Implementation
The `app/sellers/page.tsx` already uses the DataTable component. You can use it as a reference for your own pages.

## Benefits of Using DataTable
1. **DRY Principle** - Avoid repeating table logic across pages
2. **Consistency** - All tables have the same look and feel
3. **Maintainability** - Bug fixes in DataTable apply everywhere
4. **Flexibility** - Highly configurable for different use cases
5. **Type Safety** - Full TypeScript support with generics
