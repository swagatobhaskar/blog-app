# Next.js + TailwindCSS Design Guide

## Typography

- **Font Family:** `Inter`, sans-serif
- **Font Sizes:**  
    - Heading 1: `text-4xl font-bold`
    - Heading 2: `text-2xl font-semibold`
    - Body: `text-base`
    - Caption: `text-sm text-gray-500`
- **Line Height:**  
    - Headings: `leading-tight`
    - Body: `leading-relaxed`

## Colors

- **Primary:** `bg-blue-600`, `text-blue-600`
- **Secondary:** `bg-gray-700`, `text-gray-700`
- **Accent:** `bg-yellow-400`, `text-yellow-400`
- **Background:** `bg-white`, `bg-gray-50`
- **Text:** `text-gray-900`, `text-gray-700`
- **Error:** `bg-red-500`, `text-red-500`

## Component Breakdown

### Buttons

```jsx
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
    Button Text
</button>
```

### Cards

```jsx
<div className="bg-white shadow rounded p-6">
    <h2 className="text-2xl font-semibold mb-2">Card Title</h2>
    <p className="text-base text-gray-700">Card content goes here.</p>
</div>
```

### Forms

```jsx
<input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
```

### Navigation

```jsx
<nav className="flex space-x-4 bg-gray-50 p-4">
    <a className="text-blue-600 hover:underline" href="#">Home</a>
    <a className="text-gray-700 hover:underline" href="#">Blog</a>
</nav>
```

## Responsive Design

- Use Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Example:  
    `className="text-base md:text-lg lg:text-xl"`

## Spacing

- Use consistent spacing:  
    - Padding: `p-4`, `px-6`
    - Margin: `mb-4`, `mt-6`
