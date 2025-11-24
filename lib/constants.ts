// Design system constants

export const COLORS = {
    primary: {
        50: '#f0f4ff',
        100: '#e0e9ff',
        500: '#6366f1',
        600: '#4f46e5',
        700: '#4338ca',
    },
    accent: {
        purple: '#a855f7',
        pink: '#ec4899',
        cyan: '#06b6d4',
    }
}

export const GRADIENTS = {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    warm: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    cool: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
}

export const LAYOUTS = [
    { id: 'TitleSlide', name: 'Title Slide', description: 'Large title with subtitle' },
    { id: 'TitleAndBody', name: 'Title & Body', description: 'Title with body text' },
    { id: 'BulletedList', name: 'Bulleted List', description: 'Title with bullet points' },
    { id: 'SectionHeader', name: 'Section Header', description: 'Large centered title' },
    { id: 'TwoColumn', name: 'Two Column', description: 'Title with two columns' },
    { id: 'Quote', name: 'Quote', description: 'Quote with attribution' },
]

export const ZOOM_LEVELS = [
    { value: 0.5, label: '50%' },
    { value: 0.75, label: '75%' },
    { value: 1, label: '100%' },
    { value: 1.25, label: '125%' },
    { value: 1.5, label: '150%' },
]

export const KEYBOARD_SHORTCUTS = {
    undo: 'Ctrl+Z',
    redo: 'Ctrl+Y',
    save: 'Ctrl+S',
    duplicate: 'Ctrl+D',
    delete: 'Delete',
    previousSlide: 'ArrowLeft',
    nextSlide: 'ArrowRight',
}
