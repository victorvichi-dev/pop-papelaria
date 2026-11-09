const SITE_CONFIG = {
    empresa: {
        nome: "POP Papelaria & Cafeteria",
        logoUrl: "",
        // Paleta provisória para a demonstração; confirmar com a identidade visual oficial.
        corPrimaria: "#5A3E36",
        corSecundaria: "#F6F0E8",
        urlSite: ""
    },
    seo: {
        titulo: "POP | Papelaria e Cafeteria em Osvaldo Cruz",
        descricao: "Papelaria e cafeteria em Osvaldo Cruz. Conheça a POP e fale com nossa equipe.",
        imagemOg: ""
    },
    hero: {
        titulo: "Papelaria e cafeteria em um só lugar",
        texto: "Na POP, você encontra papelaria e cafeteria no centro de Osvaldo Cruz. Entre em contato para conhecer melhor a loja.",
        imagemUrl: "",
        textoBotao: "Fale com a POP"
    },
    contato: {
        whatsapp: "",
        whatsappUrl: "https://bit.ly/Fale-com-um_vendedor",
        telefone: "(18) 3528-1991",
        endereco: "Rua Hans Klotz, 538 - Centro, Osvaldo Cruz - SP",
        redesSociais: [
            { nome: "Instagram", url: "https://www.instagram.com/pop.papelariacafeteria/" }
        ],
        mapaUrl: ""
    },
    servicos: [
        { titulo: "Papelaria", descricao: "Uma opção prática para suas necessidades de papelaria no dia a dia." },
        { titulo: "Cafeteria", descricao: "Uma cafeteria integrada à loja para completar sua visita à POP." }
    ],
    diferenciais: [
        { titulo: "Papelaria + cafeteria", descricao: "Duas experiências reunidas em um só lugar." },
        { titulo: "No centro de Osvaldo Cruz", descricao: "Estamos na Rua Hans Klotz, 538." }
    ],
    galeria: [],
    avaliacoes: []
};

const FALLBACK_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="#f1f3f5"/><path d="M300 310l90-100 70 75 45-50 95 105H200z" fill="#c5ccd3"/><circle cx="330" cy="155" r="35" fill="#c5ccd3"/><text x="400" y="390" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#68727d">Imagem indisponível</text></svg>')}`;

document.addEventListener("DOMContentLoaded", () => {
    inicializarSite();
    configurarMenuMobile();
});

function isHttpsUrl(url) {
    if (typeof url !== "string" || !url.trim() || url.trim().startsWith("//")) return false;
    try {
        const parsed = new URL(url.trim());
        return parsed.protocol === "https:" && !parsed.username && !parsed.password;
    } catch (error) { return false; }
}

function isSafeUrl(url) {
    if (typeof url !== "string" || !url.trim()) return false;
    const value = url.trim();
    if (value.startsWith("//") || value.startsWith("\\\\")) return false;
    if (/^[a-z][a-z\d+.-]*:/i.test(value)) return isHttpsUrl(value);
    try {
        const parsed = new URL(value, window.location.href);
        return parsed.origin === window.location.origin &&
            (parsed.protocol === "https:" || parsed.protocol === "http:");
    } catch (error) { return false; }
}

function isValidGoogleMapsUrl(url) {
    if (!isHttpsUrl(url)) return false;
    try {
        const parsed = new URL(url.trim());
        const allowedHosts = ["google.com", "www.google.com", "maps.google.com"];
        return allowedHosts.includes(parsed.hostname) && parsed.port === "" &&
            (parsed.pathname === "/maps/embed" || parsed.pathname.startsWith("/maps/embed/"));
    } catch (error) { return false; }
}

function isValidPhoneNumber(phone) {
    if (typeof phone !== "string") return false;
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 8 && digits.length <= 15;
}
function getPhoneDigits(phone) { return phone.replace(/\D/g, ""); }

function inicializarSite() {
    if (SITE_CONFIG.empresa.corPrimaria) document.documentElement.style.setProperty("--primary-color", SITE_CONFIG.empresa.corPrimaria);
    if (SITE_CONFIG.empresa.corSecundaria) document.documentElement.style.setProperty("--secondary-color", SITE_CONFIG.empresa.corSecundaria);

    const pageTitle = SITE_CONFIG.seo.titulo || SITE_CONFIG.empresa.nome || "Sua empresa";
    document.title = pageTitle;
    safeSetText("meta-title", pageTitle);
    safeSetAttribute("meta-description", "content", SITE_CONFIG.seo.descricao);
    safeSetAttribute("og-title", "content", pageTitle);
    safeSetAttribute("og-description", "content", SITE_CONFIG.seo.descricao);
    safeSetAttribute("og-image", "content", isHttpsUrl(SITE_CONFIG.seo.imagemOg) ? SITE_CONFIG.seo.imagemOg : "");
    safeSetAttribute("og-url", "content", isHttpsUrl(SITE_CONFIG.empresa.urlSite) ? SITE_CONFIG.empresa.urlSite : "");

    safeSetText("company-name", SITE_CONFIG.empresa.nome);
    safeSetImage("header-logo", isSafeUrl(SITE_CONFIG.empresa.logoUrl) ? SITE_CONFIG.empresa.logoUrl : "");
    safeSetText("hero-title", SITE_CONFIG.hero.titulo);
    safeSetText("hero-text", SITE_CONFIG.hero.texto);

    const heroImageContainer = document.querySelector(".hero-image-container");
    safeSetImage("hero-img", isSafeUrl(SITE_CONFIG.hero.imagemUrl) ? SITE_CONFIG.hero.imagemUrl : "");
    if (heroImageContainer) heroImageContainer.style.display = isSafeUrl(SITE_CONFIG.hero.imagemUrl) ? "" : "none";

    const heroCta = document.getElementById("hero-cta");
    const whatsappUrl = isHttpsUrl(SITE_CONFIG.contato.whatsappUrl) ? SITE_CONFIG.contato.whatsappUrl : "";
    if (heroCta && (whatsappUrl || isValidPhoneNumber(SITE_CONFIG.contato.whatsapp))) {
        heroCta.textContent = SITE_CONFIG.hero.textoBotao || "Fale conosco";
        heroCta.href = whatsappUrl || `https://wa.me/${getPhoneDigits(SITE_CONFIG.contato.whatsapp)}`;
        heroCta.style.display = "inline-block";
    } else if (heroCta) {
        heroCta.style.display = "none";
        heroCta.removeAttribute("href");
    }

    const services = renderizarGrid("servicos-grid", SITE_CONFIG.servicos, buildCardTexto, "service-card");
    alternarVisibilidadeSecao("servicos", services > 0);
    const differences = renderizarGrid("diferenciais-grid", SITE_CONFIG.diferenciais, buildCardTexto, "diff-card");
    alternarVisibilidadeSecao("diferenciais", differences > 0);
    const gallery = renderizarGrid("galeria-grid", SITE_CONFIG.galeria, buildCardImagem, "gallery-card");
    alternarVisibilidadeSecao("galeria", gallery > 0);
    const reviews = renderizarGrid("avaliacoes-grid", SITE_CONFIG.avaliacoes, buildCardAvaliacao, "review-card");
    alternarVisibilidadeSecao("avaliacoes", reviews > 0);

    configurarContato();
    safeSetText("footer-text", SITE_CONFIG.empresa.nome
        ? `© ${new Date().getFullYear()} ${SITE_CONFIG.empresa.nome}. Todos os direitos reservados.`
        : "");
    atualizarLinksMenu();
}

function safeSetText(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    const hasText = typeof value === "string" && value.trim();
    element.textContent = hasText ? value : "";
    element.style.display = hasText ? "" : "none";
}
function safeSetAttribute(id, attribute, value) {
    const element = document.getElementById(id);
    if (!element) return;
    if (typeof value === "string" && value.trim()) element.setAttribute(attribute, value);
    else element.removeAttribute(attribute);
}
function applyImageFallback(event) {
    const image = event.currentTarget;
    image.onerror = null;
    image.src = FALLBACK_IMAGE;
    image.classList.add("image-fallback");
}
function safeSetImage(id, url) {
    const image = document.getElementById(id);
    if (!image) return;
    if (url) {
        image.onerror = applyImageFallback;
        image.style.display = "block";
        image.src = url;
    } else {
        image.removeAttribute("src");
        image.style.display = "none";
    }
}
function renderizarGrid(id, items, buildFn, cardClass) {
    const grid = document.getElementById(id);
    if (!grid) return 0;
    grid.replaceChildren();
    if (!Array.isArray(items)) return 0;
    let count = 0;
    items.forEach(item => {
        if (!item || typeof item !== "object") return;
        const card = document.createElement("div");
        card.className = `card ${cardClass}`;
        if (buildFn(item, card)) { grid.appendChild(card); count++; }
    });
    return count;
}
function alternarVisibilidadeSecao(id, visible) {
    const section = document.getElementById(id);
    if (section) section.style.display = visible ? "" : "none";
}
function buildCardTexto(item, card) {
    const title = typeof item.titulo === "string" ? item.titulo.trim() : "";
    const description = typeof item.descricao === "string" ? item.descricao.trim() : "";
    if (!title && !description) return false;
    if (title) { const h3 = document.createElement("h3"); h3.textContent = title; card.appendChild(h3); }
    if (description) { const p = document.createElement("p"); p.textContent = description; card.appendChild(p); }
    return true;
}
function buildCardImagem(item, card) {
    if (!isSafeUrl(item.url)) return false;
    const img = document.createElement("img");
    img.alt = typeof item.alt === "string" && item.alt.trim() ? item.alt : "Imagem da galeria";
    img.loading = "lazy";
    img.decoding = "async";
    img.onerror = applyImageFallback;
    img.src = item.url;
    card.appendChild(img);
    return true;
}
function buildCardAvaliacao(item, card) {
    const review = typeof item.texto === "string" ? item.texto.trim() : "";
    const author = typeof item.nome === "string" ? item.nome.trim() : "";
    if (!review || !author) return false;
    const p = document.createElement("p");
    const em = document.createElement("em");
    em.textContent = `"${review}"`;
    p.appendChild(em);
    const strong = document.createElement("strong");
    strong.textContent = author;
    card.append(p, strong);
    return true;
}

function configurarContato() {
    const contact = SITE_CONFIG.contato;
    const addressContainer = document.getElementById("endereco-container");
    const addressText = document.getElementById("endereco-text");
    const address = typeof contact.endereco === "string" ? contact.endereco.trim() : "";
    if (addressContainer && addressText) {
        addressText.textContent = address;
        addressContainer.style.display = address ? "" : "none";
    }

    const phoneContainer = document.getElementById("telefone-container");
    const phoneLink = document.getElementById("telefone-link");
    if (phoneContainer && phoneLink) {
        if (isValidPhoneNumber(contact.telefone)) {
            phoneLink.textContent = contact.telefone;
            phoneLink.href = `tel:${getPhoneDigits(contact.telefone)}`;
            phoneContainer.style.display = "";
        } else {
            phoneLink.removeAttribute("href"); phoneLink.textContent = ""; phoneContainer.style.display = "none";
        }
    }

    const whatsappContainer = document.getElementById("whatsapp-container");
    const whatsappLink = document.getElementById("whatsapp-link");
    if (whatsappContainer && whatsappLink) {
        const whatsappUrl = isHttpsUrl(contact.whatsappUrl) ? contact.whatsappUrl : "";
        if (whatsappUrl || isValidPhoneNumber(contact.whatsapp)) {
            whatsappLink.textContent = whatsappUrl ? "Fale com um vendedor" : contact.whatsapp;
            whatsappLink.href = whatsappUrl || `https://wa.me/${getPhoneDigits(contact.whatsapp)}`;
            whatsappContainer.style.display = "";
        } else {
            whatsappLink.removeAttribute("href"); whatsappLink.textContent = ""; whatsappContainer.style.display = "none";
        }
    }

    const socialContainer = document.getElementById("redes-sociais-container");
    if (socialContainer) {
        socialContainer.replaceChildren();
        if (Array.isArray(contact.redesSociais)) contact.redesSociais.forEach(social => {
            if (!social || !isHttpsUrl(social.url)) return;
            const link = document.createElement("a");
            link.href = social.url;
            link.textContent = typeof social.nome === "string" && social.nome.trim() ? social.nome : "Rede social";
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            socialContainer.appendChild(link);
        });
        socialContainer.style.display = socialContainer.childElementCount ? "" : "none";
    }

    const mapLinkContainer = document.getElementById("mapa-link-container");
    const mapLink = document.getElementById("mapa-link");
    if (mapLinkContainer && mapLink) {
        const explicitMapUrl = isHttpsUrl(contact.mapaUrl) ? contact.mapaUrl : "";
        const generatedMapUrl = address
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
            : "";
        const destination = explicitMapUrl || generatedMapUrl;
        if (destination) {
            mapLink.href = destination;
            mapLinkContainer.style.display = "";
        } else {
            mapLink.removeAttribute("href");
            mapLinkContainer.style.display = "none";
        }
    }

    const hasContact = Boolean(address || isValidPhoneNumber(contact.telefone) ||
        isValidPhoneNumber(contact.whatsapp) || isHttpsUrl(contact.whatsappUrl) ||
        (socialContainer && socialContainer.childElementCount) ||
        (mapLinkContainer && mapLinkContainer.style.display !== "none"));
    const section = document.getElementById("contato");
    if (section) section.style.display = hasContact ? "" : "none";
}

function atualizarLinksMenu() {
    document.querySelectorAll("#main-menu a[href^='#']").forEach(link => {
        const target = document.getElementById(link.getAttribute("href").slice(1));
        const item = link.closest("li");
        if (item) item.hidden = !target || target.style.display === "none";
    });
}
function configurarMenuMobile() {
    const button = document.getElementById("mobile-menu-btn");
    const menu = document.getElementById("main-menu");
    if (!button || !menu) return;
    const links = menu.querySelectorAll(".menu-list a");
    const setState = open => {
        button.setAttribute("aria-expanded", String(open));
        button.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
        menu.classList.toggle("active", open);
    };
    button.addEventListener("click", () => setState(button.getAttribute("aria-expanded") !== "true"));
    links.forEach(link => link.addEventListener("click", () => setState(false)));
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
            setState(false); button.focus();
        }
    });
    window.addEventListener("resize", () => { if (window.innerWidth > 768) setState(false); });
}
