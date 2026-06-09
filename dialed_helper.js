(function() {
    const CONFIG = {
        active: true,
        showLogs: true,
        dotColor: '#A36AAF',
        dotSize: '20px',
        borderWidth: '3px',
        glowRadius: '15px',
        accentColor: '#A36AAF',
        bgMain: '#141414',
        bgSidebar: '#101010',
        bgSection: '#181818',
        textLight: '#ffffff',
        textDim: '#aeaeae',
        logoSize: '21px',
        fontSize: '13px'
    };

    const THEMES = {
        honey: {
            name: 'Honey',
            accentColor: '#F7C06E',
            bgMain: '#120F09',
            bgSidebar: '#1E1A15',
            bgSection: '#1E1A15',
            textLight: '#F8F8F8',
            textDim: '#C9CBCD',
            dotColor: '#F7C06E'
        },
        sunlight: {
            name: 'Sunlight',
            accentColor: '#FD5B01',
            bgMain: '#211F2A',
            bgSidebar: '#1B1A22',
            bgSection: '#1B1A22',
            textLight: '#ffffff',
            textDim: '#999999',
            dotColor: '#FD5B01'
        },
        purple: {
            name: 'Midnight',
            accentColor: '#A36AAF',
            bgMain: '#141414',
            bgSidebar: '#101010',
            bgSection: '#181818',
            textLight: '#ffffff',
            textDim: '#aeaeae',
            dotColor: '#A36AAF'
        }
    };

    let lastColor = "";

    function printStartBanner() {
        console.log(`%cdialed.gg helper by pozdro`, `color: #ffffff; background: #111111; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-family: sans-serif; border-left: 3px solid ${CONFIG.accentColor};`);
    }

    const scrollbarStyle = document.createElement('style');
    scrollbarStyle.innerHTML = `
        .invisible-scroll-container::-webkit-scrollbar { display: none !important; }
        .invisible-scroll-container { -ms-overflow-style: none !important; scrollbar-width: none !important; }
    `;
    document.head.appendChild(scrollbarStyle);

    const dynamicStyle = document.createElement('style');
    dynamicStyle.id = 'slider-thumb-style';
    document.head.appendChild(dynamicStyle);

    function refreshDynamicStyles() {
        const color = CONFIG.accentColor;
        dynamicStyle.innerHTML = `
            .custom-slider-range { -webkit-appearance: none; width: 100%; height: 4px; border-radius: 2px; outline: none; cursor: pointer; }
            .custom-slider-range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${color}; cursor: pointer; }
            .custom-slider-range::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: ${color}; cursor: pointer; border: none; }
            .toggle-switch-wrapper { position: relative; width: 44px; height: 24px; flex-shrink: 0; }
            .toggle-switch-wrapper input { opacity: 0; width: 0; height: 0; position: absolute; }
            .toggle-track { position: absolute; inset: 0; border-radius: 12px; background: #2a2a2a; cursor: pointer; transition: background 0.2s ease; }
            .toggle-track::after { content: ''; position: absolute; width: 18px; height: 18px; border-radius: 50%; background: #555; top: 3px; left: 3px; transition: transform 0.2s ease, background 0.2s ease; }
            .toggle-switch-wrapper input:checked + .toggle-track { background: ${color}44; }
            .toggle-switch-wrapper input:checked + .toggle-track::after { transform: translateX(20px); background: ${color}; }
            .color-swatch-btn { width: 60px; height: 22px; border-radius: 3px; cursor: pointer; flex-shrink: 0; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5); position: relative; overflow: hidden; border: none; }
            .color-swatch-btn input[type=color] { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; border: none; padding: 0; }
            .theme-card { border-radius: 8px; padding: 12px 14px; cursor: pointer; border: 1px solid #2a2a2a; transition: all 0.15s ease; display: flex; align-items: center; gap: 10px; }
            .theme-card:hover { border-color: ${color}88; background: ${color}11; }
            .theme-card.active { border-color: ${color}; background: ${color}1a; }
            .theme-preview { width: 32px; height: 32px; border-radius: 6px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        `;
        document.querySelectorAll('.custom-slider-range').forEach(input => updateSliderFill(input));
    }

    function updateSliderFill(input) {
        const min = parseFloat(input.min) || 0;
        const max = parseFloat(input.max) || 100;
        const val = parseFloat(input.value) || 0;
        const pct = ((val - min) / (max - min)) * 100;
        input.style.background = `linear-gradient(to right, ${CONFIG.accentColor} ${pct}%, #2a2a2a ${pct}%)`;
    }

    refreshDynamicStyles();

    const existingGui = document.getElementById('dialed-gui');
    if (existingGui) existingGui.remove();

    const guiWrapper = document.createElement('div');
    guiWrapper.id = 'dialed-gui';
    guiWrapper.style.cssText = `
        position: fixed; top: 15%; left: 30%; width: 640px; height: 430px;
        background: ${CONFIG.bgMain}; border-radius: 6px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.7); color: ${CONFIG.textDim};
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: ${CONFIG.fontSize}; z-index: 999999;
        display: flex; overflow: hidden; user-select: none;
        transition: width 0.2s ease, height 0.2s ease;
    `;

    const sidebar = document.createElement('div');
    sidebar.style.cssText = `
        width: 160px; background: ${CONFIG.bgSidebar};
        border-right: 1px solid #1a1a1a; display: flex; flex-direction: column;
        padding-top: 20px; cursor: move; flex-shrink: 0; transition: width 0.2s ease;
    `;

    const logo = document.createElement('div');
    logo.style.cssText = `
        color: ${CONFIG.textLight}; font-weight: bold; font-size: ${CONFIG.logoSize};
        padding: 0 20px 25px 20px; display: flex; align-items: center; gap: 8px; cursor: pointer;
    `;
    logo.innerHTML = `<span class="logo-icon" style="color:${CONFIG.accentColor}; transition: transform 0.3s ease; display:inline-block;">▲</span> <span class="logo-text">DIALED</span>`;
    sidebar.appendChild(logo);

    const tabContainer = document.createElement('div');
    tabContainer.style.cssText = 'display: flex; flex-direction: column; width: 100%;';
    sidebar.appendChild(tabContainer);

    const mainContent = document.createElement('div');
    mainContent.style.cssText = `
        flex: 1; display: flex; flex-direction: column;
        background: ${CONFIG.bgMain}; transition: opacity 0.15s ease;
    `;
    guiWrapper.appendChild(sidebar);
    guiWrapper.appendChild(mainContent);
    document.body.appendChild(guiWrapper);

    const pages = {};
    let activeTab = "";

    function createPage(id, subtitle) {
        const page = document.createElement('div');
        page.style.cssText = 'display: none; flex-direction: column; flex: 1; overflow: hidden; height: 100%;';

        const tabHeader = document.createElement('div');
        tabHeader.style.cssText = 'display: flex; padding: 15px 25px 0 25px; border-bottom: 1px solid #1a1a1a; flex-shrink: 0;';

        const subTab = document.createElement('div');
        subTab.className = 'sub-tab-line';
        subTab.style.cssText = `padding-bottom: 12px; color: ${CONFIG.textLight}; font-weight: 600; border-bottom: 2px solid ${CONFIG.accentColor};`;
        subTab.innerText = subtitle;

        tabHeader.appendChild(subTab);
        page.appendChild(tabHeader);

        const scrollArea = document.createElement('div');
        scrollArea.className = 'invisible-scroll-container';
        scrollArea.style.cssText = 'display: flex; flex-direction: column; gap: 15px; padding: 20px 25px; flex: 1; overflow-y: auto;';
        page.appendChild(scrollArea);

        const rowTop = document.createElement('div');
        rowTop.style.cssText = 'display: flex; gap: 15px; width: 100%;';
        const rowBottom = document.createElement('div');
        rowBottom.style.cssText = 'display: flex; gap: 15px; width: 100%;';

        scrollArea.appendChild(rowTop);
        scrollArea.appendChild(rowBottom);

        mainContent.appendChild(page);
        pages[id] = { page, rowTop, rowBottom, subTab };
    }

    function addMenuTab(id, label, subtitle) {
        createPage(id, subtitle);

        const btn = document.createElement('div');
        btn.className = 'menu-btn-item';
        btn.style.cssText = `
            padding: 12px 20px; color: ${CONFIG.textDim}; font-weight: normal;
            background: transparent; border-left: 3px solid transparent;
            cursor: pointer; transition: all 0.15s ease;
        `;
        btn.innerText = label;

        btn.addEventListener('click', () => {
            document.querySelectorAll('.menu-btn-item').forEach(b => {
                b.style.color = CONFIG.textDim;
                b.style.background = 'transparent';
                b.style.borderLeftColor = 'transparent';
                b.style.fontWeight = 'normal';
            });
            btn.style.color = CONFIG.textLight;
            btn.style.background = CONFIG.bgMain;
            btn.style.borderLeftColor = CONFIG.accentColor;
            btn.style.fontWeight = '600';

            Object.keys(pages).forEach(k => pages[k].page.style.display = 'none');
            pages[id].page.style.display = 'flex';
            activeTab = id;
        });

        tabContainer.appendChild(btn);
    }

    function createSection(pageId, title, subtitle, position = 'top') {
        const box = document.createElement('div');
        box.className = 'section-container-box';
        box.style.cssText = `
            flex: 1; background: ${CONFIG.bgSection}; border: 1px solid #222222;
            border-radius: 4px; padding: 15px; display: flex; flex-direction: column;
            gap: 14px; height: fit-content;
        `;
        box.innerHTML = `
            <div class="section-title-text" style="color: ${CONFIG.textLight}; font-weight: bold;">${title}</div>
            <div class="section-divider-line" style="color: ${CONFIG.textDim}; font-size: 11px; border-bottom: 1px solid ${CONFIG.accentColor}; padding-bottom: 6px; margin-bottom: 2px;">${subtitle}</div>
        `;

        if (position === 'top') pages[pageId].rowTop.appendChild(box);
        else pages[pageId].rowBottom.appendChild(box);
        return box;
    }

    function addToggle(container, label, configKey, callback = null) {
        const row = document.createElement('div');
        row.className = 'label-row-text';
        row.style.cssText = `display: flex; align-items: center; justify-content: space-between; width: 100%; color: ${CONFIG[configKey] ? CONFIG.textLight : CONFIG.textDim}; gap: 10px;`;

        const span = document.createElement('span');
        span.innerText = label;

        const toggleWrapper = document.createElement('label');
        toggleWrapper.className = 'toggle-switch-wrapper';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = CONFIG[configKey];

        const track = document.createElement('div');
        track.className = 'toggle-track';

        toggleWrapper.appendChild(checkbox);
        toggleWrapper.appendChild(track);

        checkbox.addEventListener('change', (e) => {
            CONFIG[configKey] = e.target.checked;
            row.style.color = e.target.checked ? CONFIG.textLight : CONFIG.textDim;
            if (callback) callback(e.target.checked);
        });

        row.appendChild(span);
        row.appendChild(toggleWrapper);
        container.appendChild(row);
    }

    function addSlider(container, label, min, max, defaultVal, unit, callback) {
        const wrapper = document.createElement('div');
        wrapper.className = 'slider-wrapper-row';
        wrapper.style.cssText = 'display: flex; flex-direction: column; gap: 6px; width: 100%; color: inherit;';

        const textRow = document.createElement('div');
        textRow.style.cssText = 'display: flex; justify-content: space-between; font-size: 11px; width: 100%; gap: 10px;';
        textRow.innerHTML = `<span>${label}</span><span class="slider-val-preview" style="color: ${CONFIG.accentColor}; flex-shrink:0;">${defaultVal}${unit}</span>`;

        const input = document.createElement('input');
        input.className = 'custom-slider-range';
        input.type = 'range';
        input.min = min;
        input.max = max;
        input.value = defaultVal;

        updateSliderFill(input);

        input.addEventListener('input', (e) => {
            textRow.querySelector('.slider-val-preview').innerText = `${e.target.value}${unit}`;
            updateSliderFill(input);
            callback(e.target.value);
        });

        wrapper.appendChild(textRow);
        wrapper.appendChild(input);
        container.appendChild(wrapper);
    }

    function addColorPicker(container, label, defaultColor, callback) {
        const wrapper = document.createElement('div');
        wrapper.className = 'picker-wrapper-row';
        wrapper.style.cssText = 'display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 15px;';

        const labelEl = document.createElement('span');
        labelEl.style.cssText = 'text-align: left; line-height: 1.2;';
        labelEl.innerText = label;

        const swatch = document.createElement('div');
        swatch.className = 'color-swatch-btn';
        swatch.style.background = defaultColor;

        const picker = document.createElement('input');
        picker.type = 'color';
        picker.value = defaultColor;

        picker.addEventListener('input', (e) => {
            swatch.style.background = e.target.value;
            callback(e.target.value);
        });

        swatch.appendChild(picker);
        wrapper.appendChild(labelEl);
        wrapper.appendChild(swatch);
        container.appendChild(wrapper);
    }

    function applyTheme(themeKey) {
        const t = THEMES[themeKey];
        if (!t) return;
        CONFIG.accentColor = t.accentColor;
        CONFIG.bgMain = t.bgMain;
        CONFIG.bgSidebar = t.bgSidebar;
        CONFIG.bgSection = t.bgSection;
        CONFIG.textLight = t.textLight;
        CONFIG.textDim = t.textDim;
        CONFIG.dotColor = t.dotColor;
        refreshGui();

        document.querySelectorAll('.theme-card').forEach(card => {
            const cardTheme = THEMES[card.dataset.theme];
            const isActive = card.dataset.theme === themeKey;
            card.style.border = `1px solid ${isActive ? cardTheme.accentColor : cardTheme.accentColor + '33'}`;
            card.style.background = cardTheme.bgSection;
            card.classList.toggle('active', isActive);
        });
    }

    function refreshGui() {
        guiWrapper.style.background = CONFIG.bgMain;
        mainContent.style.background = CONFIG.bgMain;
        guiWrapper.style.color = CONFIG.textDim;
        guiWrapper.style.fontSize = CONFIG.fontSize;
        sidebar.style.background = CONFIG.bgSidebar;

        logo.style.color = CONFIG.textLight;
        logo.style.fontSize = CONFIG.logoSize;
        const logoIcon = logo.querySelector('.logo-icon');
        if (logoIcon) logoIcon.style.color = CONFIG.accentColor;

        document.querySelectorAll('.menu-btn-item').forEach(btn => {
            if (btn.style.borderLeftColor !== 'transparent' && btn.style.borderLeftColor !== '') {
                btn.style.borderLeftColor = CONFIG.accentColor;
                btn.style.background = CONFIG.bgMain;
                btn.style.color = CONFIG.textLight;
            } else {
                btn.style.color = CONFIG.textDim;
            }
        });

        Object.keys(pages).forEach(key => {
            pages[key].subTab.style.borderBottomColor = CONFIG.accentColor;
            pages[key].subTab.style.color = CONFIG.textLight;
        });

        document.querySelectorAll('.section-container-box').forEach(box => {
            box.style.background = CONFIG.bgSection;
            box.querySelector('.section-title-text').style.color = CONFIG.textLight;
            const divider = box.querySelector('.section-divider-line');
            divider.style.borderBottomColor = CONFIG.accentColor;
            divider.style.color = CONFIG.textDim;
        });

        document.querySelectorAll('.label-row-text').forEach(row => {
            const chk = row.querySelector('input[type=checkbox]');
            if (chk) row.style.color = chk.checked ? CONFIG.textLight : CONFIG.textDim;
        });

        document.querySelectorAll('.slider-val-preview').forEach(span => {
            span.style.color = CONFIG.accentColor;
        });

        document.querySelectorAll('.picker-wrapper-row').forEach(row => {
            const swatch = row.querySelector('.color-swatch-btn');
            const picker = row.querySelector('input[type=color]');
            const label = row.querySelector('span') ? row.querySelector('span').innerText : '';
            const map = {
                'Accent Color:': 'accentColor', 'Main Background:': 'bgMain',
                'Sidebar Background:': 'bgSidebar', 'Section Background:': 'bgSection',
                'Active Text Color:': 'textLight', 'Dim Text Color:': 'textDim',
                'Target Dot Color:': 'dotColor'
            };
            if (map[label] && swatch && picker) {
                swatch.style.background = CONFIG[map[label]];
                picker.value = CONFIG[map[label]];
            }
        });

        refreshDynamicStyles();
    }

    // TAB 1: Color Bot
    addMenuTab('colorbot', 'Color Bot', 'Main Settings');
    const sectionScanner = createSection('colorbot', 'Automation', 'Core scanner properties', 'top');
    const sectionVisuals = createSection('colorbot', 'Visual Customization', 'Target dot styling', 'top');

    addToggle(sectionScanner, 'Scanner Active', 'active', (checked) => {
        if (!checked) removeAllDots();
    });
    addToggle(sectionScanner, 'Show console logs', 'showLogs');

    addSlider(sectionVisuals, 'Target dot size', 10, 40, 20, 'px', (val) => {
        CONFIG.dotSize = `${val}px`;
        refreshDots();
    });
    addSlider(sectionVisuals, 'Glow radius', 0, 30, 15, 'px', (val) => {
        CONFIG.glowRadius = `${val}px`;
        refreshDots();
    });

    // TAB 2: Themes
    addMenuTab('themes', 'Themes', 'Select a Theme');
    const themesPage = pages['themes'].page;
    const themesScroll = themesPage.querySelector('.invisible-scroll-container');
    themesScroll.innerHTML = '';

    const themesGrid = document.createElement('div');
    themesGrid.style.cssText = 'display: flex; flex-direction: column; gap: 8px; width: 100%;';
    themesScroll.appendChild(themesGrid);

    Object.entries(THEMES).forEach(([key, theme]) => {
        const card = document.createElement('div');
        card.className = 'theme-card' + (key === 'purple' ? ' active' : '');
        card.dataset.theme = key;
        const isActive = key === 'purple';
        card.style.cssText = `
            border-radius: 8px; padding: 12px 16px; cursor: pointer;
            border: 1px solid ${isActive ? theme.accentColor : theme.accentColor + '33'};
            background: ${theme.bgSection};
            transition: all 0.15s ease; display: flex; align-items: center; gap: 12px;
        `;

        const previewDots = document.createElement('div');
        previewDots.style.cssText = 'display: flex; gap: 4px; align-items: center;';
        [theme.bgMain, theme.bgSection, theme.accentColor].forEach(c => {
            const dot = document.createElement('div');
            dot.style.cssText = `width: 14px; height: 14px; border-radius: 50%; background: ${c}; border: 1px solid #333;`;
            previewDots.appendChild(dot);
        });

        const nameEl = document.createElement('span');
        nameEl.style.cssText = `color: ${theme.textLight}; font-weight: 600; font-size: 13px; flex: 1;`;
        nameEl.innerText = theme.name;

        const accentBadge = document.createElement('span');
        accentBadge.style.cssText = `
            font-size: 10px; padding: 2px 8px; border-radius: 10px;
            background: ${theme.accentColor}22; color: ${theme.accentColor};
            border: 1px solid ${theme.accentColor}44; font-family: monospace;
        `;
        accentBadge.innerText = theme.accentColor.toUpperCase();

        card.appendChild(previewDots);
        card.appendChild(nameEl);
        card.appendChild(accentBadge);

        card.addEventListener('click', () => applyTheme(key));
        themesGrid.appendChild(card);
    });

    // TAB 3: Menu Customization
    addMenuTab('menucustom', 'Menu Customization', 'GUI Color Theme');

    const sectionBases = createSection('menucustom', 'Interface Bases', 'Main theme backgrounds', 'top');
    const sectionAccents = createSection('menucustom', 'Accents & Visuals', 'Interactive components', 'top');
    const sectionSizes = createSection('menucustom', 'Sizes & Fonts', 'Scale text and logos', 'bottom');

    addColorPicker(sectionBases, 'Main Background:', CONFIG.bgMain, (color) => {
        CONFIG.bgMain = color; refreshGui();
    });
    addColorPicker(sectionBases, 'Sidebar Background:', CONFIG.bgSidebar, (color) => {
        CONFIG.bgSidebar = color; refreshGui();
    });
    addColorPicker(sectionBases, 'Section Background:', CONFIG.bgSection, (color) => {
        CONFIG.bgSection = color; refreshGui();
    });

    addColorPicker(sectionAccents, 'Accent Color:', CONFIG.accentColor, (color) => {
        CONFIG.accentColor = color; refreshGui();
    });
    addColorPicker(sectionAccents, 'Target Dot Color:', CONFIG.dotColor, (color) => {
        CONFIG.dotColor = color; refreshDots();
    });
    addColorPicker(sectionAccents, 'Active Text Color:', CONFIG.textLight, (color) => {
        CONFIG.textLight = color; refreshGui();
    });
    addColorPicker(sectionAccents, 'Dim Text Color:', CONFIG.textDim, (color) => {
        CONFIG.textDim = color; refreshGui();
    });

    addSlider(sectionSizes, 'Logo & Icon Size', 10, 26, 15, 'px', (val) => {
        CONFIG.logoSize = `${val}px`; refreshGui();
    });
    addSlider(sectionSizes, 'Menu Font Size', 11, 18, 13, 'px', (val) => {
        CONFIG.fontSize = `${val}px`; refreshGui();
    });

    document.querySelector('.menu-btn-item').click();

    // --- COLLAPSE (drag-safe) ---
    let collapsed = true;
    let logoMouseStartX, logoMouseStartY, logoDidDrag = false;

    // Apply collapsed state on start
    mainContent.style.display = 'none';
    tabContainer.style.display = 'none';
    logo.querySelector('.logo-text').style.display = 'none';
    sidebar.style.width = '55px';
    guiWrapper.style.width = '55px';
    guiWrapper.style.height = '55px';
    logo.querySelector('.logo-icon').style.transform = 'rotate(180deg)';

    logo.addEventListener('mousedown', (e) => {
        logoMouseStartX = e.clientX;
        logoMouseStartY = e.clientY;
        logoDidDrag = false;
    });

    logo.addEventListener('click', () => {
        if (logoDidDrag) return;
        collapsed = !collapsed;
        if (collapsed) {
            mainContent.style.opacity = '0';
            setTimeout(() => {
                if (collapsed) {
                    mainContent.style.display = 'none';
                    tabContainer.style.display = 'none';
                    logo.querySelector('.logo-text').style.display = 'none';
                    sidebar.style.width = '55px';
                    guiWrapper.style.width = '55px';
                    guiWrapper.style.height = '55px';
                    logo.querySelector('.logo-icon').style.transform = 'rotate(180deg)';
                }
            }, 150);
        } else {
            sidebar.style.width = '160px';
            guiWrapper.style.width = '640px';
            guiWrapper.style.height = '430px';
            logo.querySelector('.logo-text').style.display = 'inline';
            logo.querySelector('.logo-icon').style.transform = 'rotate(0deg)';
            setTimeout(() => {
                if (!collapsed) {
                    mainContent.style.display = 'flex';
                    tabContainer.style.display = 'flex';
                    setTimeout(() => { mainContent.style.opacity = '1'; }, 10);
                }
            }, 50);
        }
    });

    // --- DRAG & DROP ---
    let isDragging = false, offsetX, offsetY;

    sidebar.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('menu-btn-item')) return;
        isDragging = true;
        offsetX = e.clientX - guiWrapper.offsetLeft;
        offsetY = e.clientY - guiWrapper.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            guiWrapper.style.left = `${e.clientX - offsetX}px`;
            guiWrapper.style.top = `${e.clientY - offsetY}px`;
        }
        if (logoMouseStartX !== undefined) {
            if (Math.abs(e.clientX - logoMouseStartX) > 4 || Math.abs(e.clientY - logoMouseStartY) > 4) {
                logoDidDrag = true;
            }
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        logoMouseStartX = undefined;
        logoMouseStartY = undefined;
    });

    let guiVisible = true;
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Insert') {
            guiVisible = !guiVisible;
            guiWrapper.style.display = guiVisible ? 'flex' : 'none';
        }
    });

    function removeAllDots() {
        document.querySelectorAll('.target-dot-helper').forEach(el => el.remove());
    }

    function refreshDots() {
        document.querySelectorAll('.target-dot-helper').forEach(dot => {
            dot.style.width = CONFIG.dotSize;
            dot.style.height = CONFIG.dotSize;
            dot.style.border = `${CONFIG.borderWidth} solid ${CONFIG.dotColor}`;
            dot.style.boxShadow = `0 0 ${CONFIG.glowRadius} ${CONFIG.dotColor}, 0 0 4px rgba(0,0,0,0.8)`;
        });
    }

    function runScanner() {
        if (!CONFIG.active) return;

        const allElements = document.querySelectorAll('*');
        let foundRGB = null;

        for (let el of allElements) {
            const bg = window.getComputedStyle(el).backgroundColor;
            if (bg && (bg.startsWith('rgb(') || bg.startsWith('rgba('))) {
                const cleanBG = bg.replace(/\s/g, '');
                if (
                    cleanBG !== 'rgb(0,0,0)' && cleanBG !== 'rgb(255,255,255)' &&
                    cleanBG !== 'rgb(21,21,21)' && cleanBG !== 'rgb(18,18,18)' &&
                    cleanBG !== 'rgb(24,24,27)' && cleanBG !== 'rgb(80,80,80)' &&
                    cleanBG !== 'rgba(0,0,0,0)'
                ) {
                    if (el.offsetWidth > 50 && el.offsetHeight > 50) {
                        foundRGB = bg;
                        break;
                    }
                }
            }
        }

        if (!foundRGB) return;

        if (foundRGB !== lastColor) {
            lastColor = foundRGB;
            if (CONFIG.showLogs) {
                console.clear();
                printStartBanner();
                console.log(`%c[Detected Color]: ${foundRGB}`, `color: ${CONFIG.accentColor}; font-weight: bold; margin-top: 5px;`);
            }
        }

        const sliders = document.querySelectorAll('[role="slider"]');
        if (sliders.length < 3) return;

        const match = foundRGB.match(/\d+/g);
        if (!match || match.length < 3) return;

        const r = parseInt(match[0]), g = parseInt(match[1]), b = parseInt(match[2]);
        let rN = r / 255, gN = g / 255, bN = b / 255;
        let max = Math.max(rN, gN, bN), min = Math.min(rN, gN, bN);
        let h, s, v = max, d = max - min;

        s = max === 0 ? 0 : d / max;
        if (max === min) { h = 0; } else {
            switch (max) {
                case rN: h = (gN - bN) / d + (gN < bN ? 6 : 0); break;
                case gN: h = (bN - rN) / d + 2; break;
                case bN: h = (rN - gN) / d + 4; break;
            }
            h /= 6;
        }

        const targets = [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
        const maxVals = [360, 100, 100];

        sliders.forEach((slider, index) => {
            slider.style.setProperty('overflow', 'visible', 'important');
            slider.style.position = 'relative';

            let dot = slider.querySelector('.target-dot-helper');
            if (!dot) {
                dot = document.createElement('div');
                dot.className = 'target-dot-helper';
                dot.style.position = 'absolute';
                dot.style.width = CONFIG.dotSize;
                dot.style.height = CONFIG.dotSize;
                dot.style.backgroundColor = '#ffffff';
                dot.style.borderRadius = '50%';
                dot.style.border = `${CONFIG.borderWidth} solid ${CONFIG.dotColor}`;
                dot.style.boxShadow = `0 0 ${CONFIG.glowRadius} ${CONFIG.dotColor}, 0 0 4px rgba(0,0,0,0.8)`;
                dot.style.zIndex = '99999';
                dot.style.pointerEvents = 'none';
                dot.style.left = '50%';
                slider.appendChild(dot);
            }

            const pct = (targets[index] / maxVals[index]) * 100;
            if (index === 0) {
                dot.style.bottom = '';
                dot.style.top = `${pct}%`;
                dot.style.transform = 'translate(-50%, -50%)';
            } else {
                dot.style.top = '';
                dot.style.bottom = `${pct}%`;
                dot.style.transform = 'translate(-50%, 50%)';
            }
        });
    }

    if (window.dialedScannerInterval) clearInterval(window.dialedScannerInterval);
    window.dialedScannerInterval = setInterval(runScanner, 100);

    console.clear();
    printStartBanner();
})();
