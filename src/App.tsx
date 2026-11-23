import { useState } from "react";
import { LOCAL_FONTS } from "./fontList";
import { removeBackground } from "@imgly/background-removal";

const templates = [
  { id: 1, title: "ليلة من العمر", type: "زفاف", style: "wedding", tag: "الأكثر اختياراً" },
  { id: 2, title: "دعوة ملكية", type: "زفاف", style: "royal", tag: "جديد" },
  { id: 3, title: "بكل فخر", type: "تخرج", style: "grad", tag: "" },
  { id: 4, title: "أهلاً صغيرتي", type: "مواليد", style: "baby", tag: "" },
  { id: 5, title: "موعد جميل", type: "زفاف", style: "floral", tag: "" },
  { id: 6, title: "فرحة تخرج", type: "تخرج", style: "minimal", tag: "" },
];

const initialProjects = [
  { name: "دعوة زواج سارة", date: "تم التعديل مؤخراً", type: "صورة" },
  { name: "دعوة تخرج نورة", date: "قبل يومين", type: "صورة" },
];

const assetCategories = ["الكل", "ورود", "أغصان", "إطارات", "زخارف", "رموز"];

const assetItems = [
  { id: 1, name: "وردة ناعمة", category: "ورود", value: "❀" },
  { id: 2, name: "زهرة كلاسيكية", category: "ورود", value: "✿" },
  { id: 3, name: "زهرة صغيرة", category: "ورود", value: "❁" },
  { id: 4, name: "وردة رباعية", category: "ورود", value: "✾" },
  { id: 5, name: "غصن نباتي", category: "أغصان", value: "❧" },
  { id: 6, name: "غصن رقيق", category: "أغصان", value: "༄" },
  { id: 7, name: "ورق نبات", category: "أغصان", value: "♧" },
  { id: 8, name: "إطار مزخرف", category: "إطارات", value: "❦" },
  { id: 9, name: "إطار ناعم", category: "إطارات", value: "◇" },
  { id: 10, name: "إطار دائري", category: "إطارات", value: "◌" },
  { id: 11, name: "نجمة", category: "زخارف", value: "✧" },
  { id: 12, name: "لمعة", category: "زخارف", value: "✦" },
  { id: 13, name: "فاصل", category: "زخارف", value: "────────" },
  { id: 14, name: "قلب", category: "رموز", value: "♡" },
  { id: 15, name: "لؤلؤة", category: "رموز", value: "◦" },
  { id: 16, name: "ماسة", category: "رموز", value: "♢" },
  { id: 17, name: "هلال", category: "رموز", value: "☾" },
  { id: 18, name: "فراشة", category: "رموز", value: "𓆸" },
];

const materials = [
  { id: "ivory", name: "ورق عاجي", background: "linear-gradient(135deg,#fffefa,#eee9dc)" },
  { id: "linen", name: "كتان", background: "repeating-linear-gradient(0deg,#eee9dc 0px,#eee9dc 2px,#e8e1d3 3px,#eee9dc 5px)" },
  { id: "marble", name: "رخام", background: "linear-gradient(135deg,#f8f6ef 0%,#e5e0d5 30%,#fffefa 55%,#ded8cc 75%,#f8f6ef 100%)" },
  { id: "silk", name: "حرير", background: "linear-gradient(120deg,#e9dfd0,#fffaf0 35%,#e4d7c5 65%,#f8f0e5)" },
  { id: "velvet", name: "مخمل أخضر", background: "radial-gradient(ellipse at 30% 20%,#426653,#173b32 75%)" },
  { id: "champagne", name: "شامبين", background: "linear-gradient(135deg,#f1e6cb,#d4c09a,#f8efd9,#c9b98f)" },
  { id: "white", name: "أبيض ناعم", background: "linear-gradient(135deg,#ffffff,#f5f4ef)" },
  { id: "sage", name: "أخضر هادئ", background: "linear-gradient(135deg,#dce4d8,#aebfae)" },
];

type CanvasElement = {
  id: number;
  kind: "text" | "asset" | "image";
  value: string;
  x: number;
  y: number;
  size: number;
  color: string;
  font?: string;
};

function App() {
  const [page, setPage] = useState("home");
  const [category, setCategory] = useState("الكل");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState(initialProjects);
  const [selected, setSelected] = useState(templates[0]);
  const [projectName, setProjectName] = useState("دعوتي الجديدة");
  const [invitationText, setInvitationText] = useState("بكل حب ندعوكم لمشاركتنا فرحتنا");
  const [font, setFont] = useState("Amiri");
  const [fontSize, setFontSize] = useState(30);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [removedImage, setRemovedImage] = useState<string | null>(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [removeBgError, setRemoveBgError] = useState("");
  const [activeTool, setActiveTool] = useState("النصوص");
  const [showNew, setShowNew] = useState(false);

  const [assetCategory, setAssetCategory] = useState("الكل");
  const [assetSearch, setAssetSearch] = useState("");
  const [material, setMaterial] = useState(materials[0]);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([
    { id: 1, kind: "text", value: "دعوة بكل حب", x: 50, y: 35, size: 30, color: "#244b3d", font: "Amiri" },
    { id: 2, kind: "text", value: "يسعدنا دعوتكم لمشاركتنا فرحتنا", x: 50, y: 55, size: 17, color: "#5c6258", font: "Amiri" },
  ]);
  const [selectedElement, setSelectedElement] = useState<number | null>(1);
  const [elementColor, setElementColor] = useState("#244b3d");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [pinterestSearch, setPinterestSearch] = useState("");
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const filteredAssets = assetItems.filter((item) => {
    const matchesCategory = assetCategory === "الكل" || item.category === assetCategory;
    const matchesSearch = item.name.includes(assetSearch);
    return matchesCategory && matchesSearch;
  });

  const addElement = (value: string, kind: "text" | "asset" = "asset") => {
    const newElement: CanvasElement = {
      id: Date.now(),
      kind,
      value,
      x: 50,
      y: 50,
      size: kind === "text" ? 24 : 42,
      color: elementColor,
      font,
    };
    setCanvasElements((current) => [...current, newElement]);
    setSelectedElement(newElement.id);
    setPage("editor");
  };

  const updateSelected = (updates: Partial<CanvasElement>) => {
    setCanvasElements((current) =>
      current.map((element) =>
        element.id === selectedElement ? { ...element, ...updates } : element
      )
    );
  };

  const deleteSelected = () => {
    setCanvasElements((current) => current.filter((element) => element.id !== selectedElement));
    setSelectedElement(null);
  };

  const handleImageUpload = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setOriginalImage(imageUrl);
    setRemovedImage(null);
    setRemoveBgError("");
    setIsRemovingBg(true);

    try {
      const result = await removeBackground(file);
      const transparentUrl = URL.createObjectURL(result);
      setRemovedImage(transparentUrl);

      const newElement: CanvasElement = {
        id: Date.now(),
        kind: "image",
        value: transparentUrl,
        x: 50,
        y: 50,
        size: 150,
        color: "#244b3d",
      };
      setCanvasElements((current) => [...current, newElement]);
      setSelectedElement(newElement.id);
      setPage("editor");
    } catch (error) {
      console.error(error);
      setRemoveBgError("تعذرت إزالة الخلفية، حاولي بصورة أخرى.");
    } finally {
      setIsRemovingBg(false);
    }
  };

  const addText = () => {
    addElement("اكتبي النص هنا", "text");
  };

  const createProject = () => {
    const name = projectName.trim() || "مشروع جديد";
    setProjects((current) => [
      { name, date: "تم إنشاؤه الآن", type: "صورة" },
      ...current,
    ]);
    setShowNew(false);
    setPage("editor");
  };

  const saveProject = () => {
    const saved = {
      name: projectName,
      date: "تم الحفظ الآن",
      type: "صورة",
      elements: canvasElements,
      material: material.id,
    };
    try {
      localStorage.setItem("roshan-project", JSON.stringify(saved));
      setProjects((current) => [
        { name: projectName, date: "تم الحفظ الآن", type: "صورة" },
        ...current.filter((project) => project.name !== projectName),
      ]);
      alert("تم حفظ مشروعك على هذا الجهاز");
    } catch {
      alert("تعذر حفظ المشروع في المتصفح");
    }
  };

  const downloadDesign = () => {
    const canvas = document.querySelector(".design-canvas") as HTMLElement | null;
    if (!canvas) return;
    window.print();
  };

  const openPinterest = () => {
    const query = pinterestSearch.trim() || "wedding invitation design";
    window.open(
      `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const generateLocalSuggestion = () => {
    const prompt = aiPrompt.trim();
    if (!prompt) {
      setAiSuggestion("اكتبي نوع المناسبة أو الستايل الذي تبحثين عنه أولاً.");
      return;
    }

    const lower = prompt.toLowerCase();
    let suggestion = "استخدمي خلفية عاجية، خطاً عربياً أنيقاً، وتفاصيل شامبين بسيطة.";

    if (prompt.includes("زواج") || lower.includes("wedding")) {
      suggestion = "اقتراح الزفاف: خلفية عاجية أو حريرية، عنوان بخط Amiri، ورود بيضاء صغيرة، ولمسات شامبين.";
    } else if (prompt.includes("تخرج") || lower.includes("graduation")) {
      suggestion = "اقتراح التخرج: خلفية خضراء هادئة، عنوان واضح، إطار رفيع بلون الشامبين، ورمز قبعة تخرج.";
    } else if (prompt.includes("مواليد") || lower.includes("baby")) {
      suggestion = "اقتراح المواليد: خلفية كريمية، ألوان باستيل، زخارف ناعمة، ومساحات واسعة للنص.";
    } else if (prompt.includes("ملكي") || lower.includes("royal")) {
      suggestion = "الستايل الملكي: أخضر عميق، ذهبي شامبين، إطار كلاسيكي، وخط عربي بارز.";
    }

    setAiSuggestion(suggestion);
  };

  const moveSelected = (direction: "up" | "down" | "left" | "right") => {
    const element = canvasElements.find((item) => item.id === selectedElement);
    if (!element) return;
    const step = 3;
    updateSelected({
      x: Math.max(5, Math.min(95, element.x + (direction === "left" ? -step : direction === "right" ? step : 0))),
      y: Math.max(5, Math.min(95, element.y + (direction === "up" ? -step : direction === "down" ? step : 0))),
    });
  };

  const handleCanvasPointerDown = (event: any, id: number) => {
    event.preventDefault();
    setSelectedElement(id);
    setDraggingId(id);
  };

  const handleCanvasPointerMove = (event: any) => {
    if (draggingId === null) return;
    const canvas = document.querySelector(".design-canvas") as HTMLElement | null;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(3, Math.min(97, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(3, Math.min(97, ((event.clientY - rect.top) / rect.height) * 100));

    setCanvasElements((current) =>
      current.map((element) =>
        element.id === draggingId ? { ...element, x, y } : element
      )
    );
  };

  const handleCanvasPointerUp = () => setDraggingId(null);

  return (
    <div className="roshan" dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Amiri:wght@400;700&display=swap');

        * { box-sizing: border-box; }
        body { margin: 0; background: #f5f3ed; }
        button, input, select, textarea { font: inherit; }
        button { cursor: pointer; }
        .roshan {
          min-height: 100vh;
          background: #f5f3ed;
          color: #253d33;
          font-family: 'DM Sans', Tahoma, sans-serif;
        }
        .shell { display: flex; min-height: 100vh; }
        .sidebar {
          width: 245px;
          flex-shrink: 0;
          background: #173b32;
          color: #fffefa;
          padding: 28px 18px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .brand { padding: 8px 12px 20px; border-bottom: 1px solid #ffffff20; }
        .brand-logo {
          font-family: 'Amiri', serif;
          font-size: 38px;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .brand-sub { color: #d1c6a8; font-size: 10px; letter-spacing: 3px; margin-top: -5px; }
        .nav-label { color: #aabbb0; font-size: 10px; padding: 0 12px; margin-bottom: 8px; }
        .nav-list { display: grid; gap: 6px; }
        .nav-item {
          width: 100%;
          border: 0;
          background: transparent;
          color: #e7ece7;
          padding: 12px;
          border-radius: 10px;
          text-align: right;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          transition: .2s;
        }
        .nav-item:hover, .nav-item.active { background: #ffffff18; color: #fff; }
        .nav-icon { width: 22px; text-align: center; color: #d2c49e; font-size: 17px; }
        .sidebar-bottom { margin-top: auto; border-top: 1px solid #ffffff20; padding: 18px 10px 0; color: #c8d1ca; font-size: 11px; line-height: 1.8; }
        .main { flex: 1; min-width: 0; }
        .topbar {
          height: 76px;
          background: #fffefa;
          border-bottom: 1px solid #e9e5da;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 34px;
        }
        .topbar-title { font-size: 14px; font-weight: 600; }
        .topbar-sub { color: #8b9188; font-size: 11px; margin-top: 4px; }
        .top-actions { display: flex; align-items: center; gap: 12px; }
        .avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: #e8e2d3; color: #315c4b;
          display: grid; place-items: center; font-family: Amiri,serif; font-size: 19px;
        }
        .primary-btn {
          border: 0; border-radius: 9px; padding: 11px 17px;
          background: #244b3d; color: white; font-size: 12px;
        }
        .primary-btn:hover { background: #315c4b; }
        .secondary-btn {
          border: 1px solid #ded9cc; border-radius: 9px; padding: 10px 15px;
          color: #315c4b; background: #fffefa; font-size: 12px;
        }
        .content { padding: 30px 34px 55px; max-width: 1500px; margin: auto; }
        .welcome {
          border-radius: 17px; padding: 30px 34px; color: #fffefa;
          background: linear-gradient(115deg,#173b32,#315c4b);
          display: flex; align-items: center; justify-content: space-between;
          overflow: hidden; position: relative;
        }
        .welcome:after {
          content: "✧"; position: absolute; left: 10%; top: -45px;
          font-size: 190px; color: #ffffff0b; pointer-events: none;
        }
        .welcome h1 { font-family: Amiri,serif; font-size: 31px; margin: 0 0 7px; font-weight: 400; }
        .welcome p { margin: 0; color: #d4ded5; font-size: 12px; }
        .welcome .primary-btn { background: #e4d7b8; color: #173b32; position: relative; z-index: 1; }
        .section-head { display: flex; justify-content: space-between; align-items: center; margin: 30px 0 16px; }
        .section-head h2 { margin: 0; font-size: 16px; font-weight: 600; }
        .muted-link { border: 0; background: none; color: #7b887d; font-size: 11px; }
        .stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-top: 20px; }
        .stat-card { background: #fffefa; border: 1px solid #ebe7dc; border-radius: 13px; padding: 18px; }
        .stat-label { color: #899087; font-size: 11px; }
        .stat-number { font-size: 25px; font-weight: 600; margin-top: 9px; color: #244b3d; }
        .quick-actions { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
        .quick-card {
          background: #fffefa; border: 1px solid #ebe7dc; border-radius: 12px;
          padding: 18px; text-align: right; color: #315c4b;
        }
        .quick-card:hover { border-color: #c9b98f; transform: translateY(-2px); }
        .quick-icon { font-size: 22px; margin-bottom: 10px; }
        .quick-card strong { display: block; font-size: 12px; }
        .quick-card small { display: block; color: #92968d; font-size: 10px; margin-top: 5px; }
        .template-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 18px; }
        .template-card { background: #fffefa; border: 1px solid #ebe7dc; border-radius: 13px; overflow: hidden; }
        .preview { height: 220px; padding: 22px; display: grid; place-items: center; position: relative; background: #e9e2d4; }
        .preview.wedding { background: linear-gradient(135deg,#e9e2d4,#f9f5ed); }
        .preview.royal { background: linear-gradient(135deg,#244b3d,#173b32); }
        .preview.grad { background: linear-gradient(135deg,#e8e2d4,#d5dfd2); }
        .preview.baby { background: linear-gradient(135deg,#f2e8e3,#e7e4d8); }
        .preview.floral { background: linear-gradient(135deg,#e5e9df,#f5f1e7); }
        .preview.minimal { background: linear-gradient(135deg,#e9e5da,#fffefa); }
        .invite-paper {
          width: 72%; height: 90%; background: #fffefa; border: 1px solid #c9b98f;
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          box-shadow: 0 5px 18px #00000012; color: #315c4b;
        }
        .royal .invite-paper { background: #f4eee1; }
        .invite-title { font-family: Amiri,serif; font-size: 24px; margin: 8px 0; }
        .invite-small { font-family: Amiri,serif; font-size: 11px; color: #8b8069; }
        .invite-ornament { color: #bba77a; font-size: 17px; }
        .tag { position: absolute; top: 12px; right: 12px; background: #fffefa; color: #315c4b; border-radius: 20px; padding: 5px 9px; font-size: 9px; }
        .card-info { padding: 13px 15px; display: flex; justify-content: space-between; align-items: center; gap: 8px; }
        .card-info strong { display: block; font-size: 12px; }
        .card-info small { display: block; color: #92968d; font-size: 10px; margin-top: 5px; }
        .edit-link { border: 0; background: none; color: #315c4b; font-size: 10px; white-space: nowrap; }
        .project-list { display: grid; gap: 9px; }
        .project-row { display: flex; align-items: center; justify-content: space-between; padding: 13px 16px; background: #fffefa; border: 1px solid #ebe7dc; border-radius: 10px; }
        .project-row strong { font-size: 12px; }
        .project-row small { display: block; color: #92968d; font-size: 10px; margin-top: 4px; }
        .search-input, .text-input, .select-input, .text-area {
          width: 100%; border: 1px solid #e5e0d5; background: #fffefa;
          border-radius: 9px; padding: 11px 13px; color: #244b3d; outline: none; font-size: 12px;
        }
        .search-input:focus, .text-input:focus, .text-area:focus { border-color: #9aab9a; }
        .filter-row { display: flex; flex-wrap: wrap; gap: 8px; margin: 15px 0; }
        .filter-chip { border: 1px solid #e2ded3; border-radius: 20px; background: #fffefa; padding: 7px 13px; font-size: 10px; color: #667368; }
        .filter-chip.active { background: #244b3d; border-color: #244b3d; color: white; }
        .asset-grid { display: grid; grid-template-columns: repeat(6,minmax(0,1fr)); gap: 11px; }
        .asset-card {
          background: #fffefa; border: 1px solid #ebe7dc; border-radius: 11px;
          min-height: 105px; padding: 12px 8px; display: flex; flex-direction: column;
          justify-content: center; align-items: center; gap: 8px; color: #315c4b;
        }
        .asset-card:hover { border-color: #c9b98f; background: #fbf9f2; }
        .asset-symbol { font-family: Amiri,serif; font-size: 35px; line-height: 1.1; }
        .asset-card small { font-size: 10px; color: #858d82; }
        .material-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 12px; }
        .material-card { border: 2px solid transparent; border-radius: 12px; overflow: hidden; background: #fffefa; text-align: right; }
        .material-card.active { border-color: #315c4b; }
        .material-swatch { height: 85px; }
        .material-card span { display: block; padding: 9px 11px; font-size: 11px; }
        .editor { display: grid; grid-template-columns: 285px minmax(0,1fr); min-height: calc(100vh - 76px); }
        .editor-panel { background: #fffefa; border-left: 1px solid #e9e5da; padding: 20px; overflow-y: auto; }
        .editor-panel h3 { margin: 0 0 16px; font-size: 14px; }
        .tool-tabs { display: grid; grid-template-columns: repeat(3,1fr); gap: 5px; margin-bottom: 20px; }
        .tool-tab { border: 0; background: #f4f2ec; padding: 10px 4px; border-radius: 8px; color: #68756b; font-size: 10px; }
        .tool-tab.active { background: #244b3d; color: white; }
        .field-label { display: block; font-size: 10px; color: #778176; margin: 15px 0 7px; }
        .editor-stage { padding: 25px; display: flex; flex-direction: column; align-items: center; background: #eeece5; min-width: 0; }
        .stage-toolbar { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; gap: 10px; }
        .stage-toolbar strong { font-size: 12px; }
        .stage-actions { display: flex; gap: 7px; }
        .design-canvas {
          width: min(100%,520px); aspect-ratio: 3 / 4; position: relative;
          overflow: hidden; box-shadow: 0 8px 30px #00000016; border: 1px solid #d8d1c2;
          touch-action: none; user-select: none;
        }
        .canvas-element {
          position: absolute; transform: translate(-50%,-50%); cursor: grab;
          white-space: pre-wrap; text-align: center; max-width: 90%;
          touch-action: none; user-select: none;
        }
        .canvas-element.selected { outline: 1px dashed #b69d65; outline-offset: 7px; }
        .canvas-element img { max-width: 100%; max-height: 180px; object-fit: contain; pointer-events: none; }
        .element-actions { display: grid; grid-template-columns: repeat(4,1fr); gap: 6px; margin-top: 10px; }
        .small-action { border: 1px solid #e5e0d5; border-radius: 7px; background: #fffefa; padding: 8px 3px; color: #315c4b; font-size: 11px; }
        .upload-box { border: 1px dashed #c9c3b4; border-radius: 10px; padding: 17px; text-align: center; color: #7d887d; font-size: 11px; }
        .upload-box input { width: 100%; margin-top: 12px; font-size: 10px; }
        .image-preview { width: 100%; max-height: 130px; object-fit: contain; margin-top: 10px; }
        .hint { color: #92968d; font-size: 10px; line-height: 1.8; }
        .empty-state { padding: 35px; text-align: center; color: #92968d; background: #fffefa; border: 1px dashed #ddd7c9; border-radius: 12px; font-size: 12px; }
        .modal-backdrop { position: fixed; inset: 0; z-index: 20; background: #14251f80; display: grid; place-items: center; padding: 20px; }
        .modal { width: min(100%,420px); background: #fffefa; border-radius: 16px; padding: 25px; box-shadow: 0 15px 50px #0003; }
        .modal h2 { margin: 0 0 18px; font-family: Amiri,serif; font-size: 25px; }
        .modal-actions { display: flex; gap: 9px; margin-top: 18px; justify-content: flex-start; }
        .ai-result { background: #f3f1e9; border: 1px solid #e6e0d2; padding: 15px; border-radius: 10px; margin-top: 15px; font-size: 12px; line-height: 1.9; }
        .pinterest-banner { padding: 25px; background: linear-gradient(120deg,#173b32,#315c4b); border-radius: 14px; color: white; }
        .pinterest-banner h2 { font-family: Amiri,serif; font-size: 27px; margin: 0 0 7px; }
        .pinterest-banner p { font-size: 11px; color: #dce4dc; }
        @media(max-width:900px) {
          .sidebar { width: 205px; }
          .template-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .asset-grid { grid-template-columns: repeat(4,minmax(0,1fr)); }
          .editor { grid-template-columns: 250px minmax(0,1fr); }
        }
        @media(max-width:650px) {
          .shell { display: block; }
          .sidebar { width: 100%; padding: 10px 12px; gap: 8px; }
          .brand { padding: 4px 8px 8px; border: 0; }
          .brand-logo { font-size: 27px; }
          .brand-sub { font-size: 8px; }
          .sidebar nav { overflow-x: auto; }
          .nav-label, .sidebar-bottom { display: none; }
          .nav-list { display: flex; width: max-content; gap: 5px; }
          .nav-item { width: auto; padding: 9px 11px; font-size: 10px; white-space: nowrap; }
          .nav-icon { width: auto; }
          .topbar { height: 62px; padding: 0 15px; }
          .content { padding: 18px 14px 35px; }
          .welcome { padding: 22px 18px; }
          .welcome h1 { font-size: 24px; }
          .welcome p { max-width: 190px; line-height: 1.7; }
          .welcome .primary-btn { padding: 9px 10px; font-size: 10px; }
          .stats { gap: 7px; }
          .stat-card { padding: 12px; }
          .stat-number { font-size: 20px; }
          .quick-actions { grid-template-columns: repeat(2,1fr); }
          .template-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
          .preview { height: 170px; padding: 12px; }
          .invite-title { font-size: 19px; }
          .card-info { padding: 10px; display: block; }
          .edit-link { margin-top: 8px; }
          .asset-grid { grid-template-columns: repeat(3,minmax(0,1fr)); }
          .material-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .editor { display: flex; flex-direction: column-reverse; }
          .editor-panel { border-left: 0; border-top: 1px solid #e9e5da; }
          .editor-stage { padding: 15px; }
          .design-canvas { width: min(100%,420px); }
          .stage-toolbar { flex-wrap: wrap; }
        }
        @media print {
          body * { visibility: hidden; }
          .design-canvas, .design-canvas * { visibility: visible; }
          .design-canvas { position: fixed; inset: 0; width: 100%; height: 100%; box-shadow: none; }
        }
      `}</style>

      <div className="shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-logo">رُوشان</div>
            <div className="brand-sub">STUDIO AI</div>
          </div>

          <nav>
            <div className="nav-label">القائمة الرئيسية</div>
            <div className="nav-list">
              {[
                ["home", "⌂", "الرئيسية"],
                ["templates", "▧", "القوالب"],
                ["projects", "▤", "مشاريعي"],
                ["assets", "✿", "العناصر والخامات"],
                ["fonts", "Aa", "الخطوط"],
                ["ai", "✧", "استوديو الذكاء الاصطناعي"],
                ["pinterest", "◉", "Pinterest"],
              ].map(([id, icon, label]) => (
                <button
                  key={id}
                  className={`nav-item ${page === id ? "active" : ""}`}
                  onClick={() => setPage(id)}
                >
                  <span className="nav-icon">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </nav>

          <div className="sidebar-bottom">
            ROSHAN STUDIO AI
            <br />
            مساحة إبداعك لتصميم الدعوات
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div>
              <div className="topbar-title">
                {page === "editor" ? "محرر التصميم" :
                  page === "home" ? "مساحة عملك" :
                  page === "templates" ? "القوالب" :
                  page === "projects" ? "مشاريعي" :
                  page === "assets" ? "العناصر والخامات" :
                  page === "fonts" ? "الخطوط" :
                  page === "ai" ? "استوديو الذكاء الاصطناعي" : "Pinterest"}
              </div>
              <div className="topbar-sub">أهلاً بك في مساحة روشان الإبداعية</div>
            </div>

            <div className="top-actions">
              <button className="primary-btn" onClick={() => setShowNew(true)}>
                + تصميم جديد
              </button>
              <div className="avatar">رُ</div>
            </div>
          </header>

          {page === "editor" ? (
            <section className="editor">
              <aside className="editor-panel">
                <h3>أدوات التصميم</h3>

                <div className="tool-tabs">
                  {["النصوص", "العناصر", "الخلفية"].map((tool) => (
                    <button
                      key={tool}
                      className={`tool-tab ${activeTool === tool ? "active" : ""}`}
                      onClick={() => setActiveTool(tool)}
                    >
                      {tool}
                    </button>
                  ))}
                </div>

                {activeTool === "النصوص" && (
                  <>
                    <label className="field-label">اسم التصميم</label>
                    <input
                      className="text-input"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />

                    <label className="field-label">إضافة نص جديد</label>
                    <button className="primary-btn" style={{ width: "100%" }} onClick={addText}>
                      + إضافة نص
                    </button>

                    <label className="field-label">الخط</label>
                    <select
                      className="select-input"
                      value={font}
                      onChange={(e) => {
                        setFont(e.target.value);
                        updateSelected({ font: e.target.value });
                      }}
                    >
                      {LOCAL_FONTS.map((f: any, i: number) => {
                        const value = typeof f === "string" ? f : f.name || f.label || f.family;
                        return <option key={i} value={value}>{value}</option>;
                      })}
                    </select>

                    <label className="field-label">حجم النص</label>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={
                        canvasElements.find((item) => item.id === selectedElement)?.size ?? fontSize
                      }
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setFontSize(value);
                        updateSelected({ size: value });
                      }}
                      style={{ width: "100%" }}
                    />

                    <label className="field-label">تعديل النص المحدد</label>
                    <textarea
                      className="text-area"
                      rows={3}
                      value={
                        canvasElements.find((item) => item.id === selectedElement)?.kind === "text"
                          ? canvasElements.find((item) => item.id === selectedElement)?.value ?? ""
                          : invitationText
                      }
                      onChange={(e) => {
                        setInvitationText(e.target.value);
                        updateSelected({ value: e.target.value });
                      }}
                      placeholder="اكتبي النص هنا"
                    />

                    <label className="field-label">لون العنصر</label>
                    <input
                      type="color"
                      value={
                        canvasElements.find((item) => item.id === selectedElement)?.color ?? elementColor
                      }
                      onChange={(e) => {
                        setElementColor(e.target.value);
                        updateSelected({ color: e.target.value });
                      }}
                      style={{ width: "100%", height: 38, border: 0, background: "transparent" }}
                    />

                    <div className="element-actions">
                      <button className="small-action" onClick={() => moveSelected("up")}>↑</button>
                      <button className="small-action" onClick={() => moveSelected("down")}>↓</button>
                      <button className="small-action" onClick={() => moveSelected("right")}>←</button>
                      <button className="small-action" onClick={() => moveSelected("left")}>→</button>
                    </div>

                    <button
                      className="secondary-btn"
                      style={{ width: "100%", marginTop: 10 }}
                      onClick={deleteSelected}
                    >
                      حذف العنصر المحدد
                    </button>
                  </>
                )}

                {activeTool === "العناصر" && (
                  <>
                    <label className="field-label">ابحثي عن عنصر</label>
                    <input
                      className="search-input"
                      placeholder="ورود، إطار، زخارف..."
                      value={assetSearch}
                      onChange={(e) => setAssetSearch(e.target.value)}
                    />

                    <div className="filter-row">
                      {assetCategories.map((cat) => (
                        <button
                          key={cat}
                          className={`filter-chip ${assetCategory === cat ? "active" : ""}`}
                          onClick={() => setAssetCategory(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="asset-grid" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}>
                      {filteredAssets.map((item) => (
                        <button
                          className="asset-card"
                          key={item.id}
                          onClick={() => addElement(item.value)}
                        >
                          <span className="asset-symbol">{item.value}</span>
                          <small>{item.name}</small>
                        </button>
                      ))}
                    </div>

                    <label className="field-label">رفع صورة من جهازك</label>
                    <div className="upload-box">
                      اختاري صورة لإزالة خلفيتها وإضافتها للتصميم
                      <input type="file" accept="image/*" onChange={handleImageUpload} />
                      {isRemovingBg && <p>جارٍ إزالة الخلفية، انتظري...</p>}
                      {removeBgError && <p style={{ color: "#b44" }}>{removeBgError}</p>}
                      {originalImage && !removedImage && (
                        <img src={originalImage} className="image-preview" alt="الصورة الأصلية" />
                      )}
                      {removedImage && (
                        <p style={{ color: "#315c4b" }}>تمت إزالة الخلفية وإضافة الصورة للتصميم.</p>
                      )}
                    </div>
                  </>
                )}

                {activeTool === "الخلفية" && (
                  <>
                    <label className="field-label">اختاري خامة الخلفية</label>
                    <div className="material-grid" style={{ gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>
                      {materials.map((item) => (
                        <button
                          key={item.id}
                          className={`material-card ${material.id === item.id ? "active" : ""}`}
                          onClick={() => setMaterial(item)}
                        >
                          <div className="material-swatch" style={{ background: item.background }} />
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>
                    <p className="hint">اختيار الخامة يغيّر خلفية لوحة التصميم مباشرة.</p>
                  </>
                )}
              </aside>

              <div
                className="editor-stage"
                onPointerMove={handleCanvasPointerMove}
                onPointerUp={handleCanvasPointerUp}
                onPointerLeave={handleCanvasPointerUp}
              >
                <div className="stage-toolbar">
                  <strong>{projectName}</strong>
                  <div className="stage-actions">
                    <button className="secondary-btn" onClick={saveProject}>حفظ</button>
                    <button className="primary-btn" onClick={downloadDesign}>تصدير</button>
                  </div>
                </div>

                <div className="design-canvas" style={{ background: material.background }}>
                  {canvasElements.map((element) => (
                    <div
                      key={element.id}
                      className={`canvas-element ${selectedElement === element.id ? "selected" : ""}`}
                      style={{
                        left: `${element.x}%`,
                        top: `${element.y}%`,
                        fontSize: `${element.size}px`,
                        color: element.color,
                        fontFamily: element.font || "Amiri",
                        zIndex: selectedElement === element.id ? 5 : 1,
                      }}
                      onPointerDown={(e) => handleCanvasPointerDown(e, element.id)}
                      onClick={() => setSelectedElement(element.id)}
                    >
                      {element.kind === "image" ? (
                        <img src={element.value} alt="عنصر مضاف" draggable={false} />
                      ) : (
                        element.value
                      )}
                    </div>
                  ))}
                </div>

                <p className="hint" style={{ marginTop: 16 }}>
                  اختاري العنصر ثم اسحبيه لتغيير مكانه. يمكنك تعديل حجمه ولونه من لوحة الأدوات.
                </p>
              </div>
            </section>
          ) : (
            <div className="content">
              {page === "home" && (
                <>
                  <section className="welcome">
                    <div>
                      <h1>أهلاً بك في روشان ✧</h1>
                      <p>كل فكرة جميلة تبدأ من هنا. صممي دعوتك بطريقتك.</p>
                    </div>
                    <button className="primary-btn" onClick={() => setShowNew(true)}>
                      ابدئي تصميمك
                    </button>
                  </section>

                  <div className="stats">
                    <div className="stat-card">
                      <div className="stat-label">مشاريعك</div>
                      <div className="stat-number">{projects.length}</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">القوالب المتاحة</div>
                      <div className="stat-number">{templates.length}</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">العناصر والزخارف</div>
                      <div className="stat-number">{assetItems.length}</div>
                    </div>
                  </div>

                  <div className="section-head">
                    <h2>ابدئي من هنا</h2>
                  </div>

                  <div className="quick-actions">
                    {[
                      ["✧", "تصميم جديد", "ابدئي لوحة فارغة", () => setShowNew(true)],
                      ["▧", "القوالب", "اختاري قالباً جاهزاً", () => setPage("templates")],
                      ["✿", "العناصر والخامات", "اكتشفي المكتبة", () => setPage("assets")],
                      ["◉", "Pinterest", "ابحثي عن الإلهام", () => setPage("pinterest")],
                    ].map(([icon, title, desc, action]: any) => (
                      <button className="quick-card" key={title} onClick={action}>
                        <div className="quick-icon">{icon}</div>
                        <strong>{title}</strong>
                        <small>{desc}</small>
                      </button>
                    ))}
                  </div>

                  <div className="section-head">
                    <h2>قوالب مختارة</h2>
                    <button className="muted-link" onClick={() => setPage("templates")}>عرض الكل ←</button>
                  </div>

                  <div className="template-grid">
                    {templates.slice(0, 3).map((item) => (
                      <TemplateCard
                        key={item.id}
                        item={item}
                        onChoose={() => {
                          setSelected(item);
                          setProjectName(item.title);
                          setPage("editor");
                        }}
                      />
                    ))}
                  </div>

                  <div className="section-head">
                    <h2>آخر مشاريعك</h2>
                    <button className="muted-link" onClick={() => setPage("projects")}>عرض الكل ←</button>
                  </div>

                  <div className="project-list">
                    {projects.slice(0, 3).map((project, i) => (
                      <div className="project-row" key={i}>
                        <div>
                          <strong>{project.name}</strong>
                          <small>{project.date} · {project.type}</small>
                        </div>
                        <button className="edit-link" onClick={() => {
                          setProjectName(project.name);
                          setPage("editor");
                        }}>
                          فتح المشروع ←
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {page === "templates" && (
                <>
                  <div className="section-head">
                    <h2>اختاري القالب المناسب</h2>
                  </div>

                  <div className="filter-row">
                    {["الكل", "زفاف", "تخرج", "مواليد"].map((cat) => (
                      <button
                        key={cat}
                        className={`filter-chip ${category === cat ? "active" : ""}`}
                        onClick={() => setCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="template-grid">
                    {templates
                      .filter((item) => category === "الكل" || item.type === category)
                      .filter((item) => item.title.includes(search))
                      .map((item) => (
                        <TemplateCard
                          key={item.id}
                          item={item}
                          onChoose={() => {
                            setSelected(item);
                            setProjectName(item.title);
                            setPage("editor");
                          }}
                        />
                      ))}
                  </div>
                </>
              )}

              {page === "projects" && (
                <>
                  <div className="section-head">
                    <h2>مشاريعك وتصاميمك</h2>
                    <button className="primary-btn" onClick={() => setShowNew(true)}>+ مشروع جديد</button>
                  </div>

                  {projects.length === 0 ? (
                    <div className="empty-state">ما عندك مشاريع حتى الآن. ابدئي تصميمك الأول.</div>
                  ) : (
                    <div className="project-list">
                      {projects.map((project, i) => (
                        <div className="project-row" key={i}>
                          <div>
                            <strong>{project.name}</strong>
                            <small>{project.date} · {project.type}</small>
                          </div>
                          <button
                            className="edit-link"
                            onClick={() => {
                              setProjectName(project.name);
                              setPage("editor");
                            }}
                          >
                            فتح المشروع ←
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {page === "assets" && (
                <>
                  <div className="section-head">
                    <h2>مكتبة العناصر</h2>
                    <span className="hint">{filteredAssets.length} عنصر</span>
                  </div>

                  <input
                    className="search-input"
                    placeholder="ابحثي عن وردة، إطار، زخرفة..."
                    value={assetSearch}
                    onChange={(e) => setAssetSearch(e.target.value)}
                  />

                  <div className="filter-row">
                    {assetCategories.map((cat) => (
                      <button
                        key={cat}
                        className={`filter-chip ${assetCategory === cat ? "active" : ""}`}
                        onClick={() => setAssetCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {filteredAssets.length === 0 ? (
                    <div className="empty-state">لم نعثر على عناصر مطابقة للبحث.</div>
                  ) : (
                    <div className="asset-grid">
                      {filteredAssets.map((item) => (
                        <button
                          className="asset-card"
                          key={item.id}
                          onClick={() => addElement(item.value)}
                        >
                          <span className="asset-symbol">{item.value}</span>
                          <small>{item.name}</small>
                          <small>+ إضافة للتصميم</small>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="section-head">
                    <h2>مكتبة الخامات</h2>
                  </div>

                  <div className="material-grid">
                    {materials.map((item) => (
                      <button
                        key={item.id}
                        className={`material-card ${material.id === item.id ? "active" : ""}`}
                        onClick={() => {
                          setMaterial(item);
                          setPage("editor");
                        }}
                      >
                        <div className="material-swatch" style={{ background: item.background }} />
                        <span>{item.name} · استخدميها</span>
                      </button>
                    ))}
                  </div>

                  <div className="section-head">
                    <h2>إضافة صورك الخاصة</h2>
                  </div>

                  <div className="upload-box">
                    ارفعي صورة من جهازك لإزالة خلفيتها وإضافتها إلى التصميم.
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    {isRemovingBg && <p>جارٍ معالجة الصورة...</p>}
                    {removeBgError && <p style={{ color: "#b44" }}>{removeBgError}</p>}
                    {removedImage && <p>تمت إزالة الخلفية بنجاح وإضافة العنصر للمحرر.</p>}
                  </div>
                </>
              )}

        {page === "fonts" && (
  <>
    <div className="section-head">
      <h2>مكتبة الخطوط</h2>
    </div>

    <p className="hint">استعرضي جميع الخطوط وشاهدي شكل كلمة روشان بكل خط.</p>

    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))",
      gap: 14,
      marginTop: 20
    }}>
      {LOCAL_FONTS.map((f: any, i: number) => {
        const name = typeof f === "string"
          ? f
          : f.name || f.label || f.family;

        return (
          <div
            key={i}
            className="project-row"
            style={{
              minHeight: 115,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              background: "#fffefa",
              border: "1px solid #e8e4d9",
              borderRadius: 14,
              padding: 14,
              textAlign: "center"
            }}
          >
            <span style={{
              fontSize: 12,
              color: "#a49370"
            }}>
              الخط {i + 1}
            </span>

            <strong style={{
              fontFamily: name,
              fontSize: 30,
              color: "#244b3d",
              fontWeight: 500
            }}>
              روشان
            </strong>
          </div>
        );
      })}
    </div>
  </>
)}

              {page === "ai" && (
                <>
                  <section className="pinterest-banner">
                    <h2>استوديو روشان الذكي ✧</h2>
                    <p>ابدئي بوصف فكرتك للحصول على اقتراحات تصميم وألوان وتنسيقات.</p>
                  </section>

                  <div className="section-head">
                    <h2>مساعد التصميم</h2>
                  </div>

                  <label className="field-label">ما التصميم الذي تفكرين فيه؟</label>
                  <textarea
                    className="text-area"
                    rows={4}
                    placeholder="مثلاً: دعوة زواج ملكية باللون الأخضر والذهبي..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />

                  <button
                    className="primary-btn"
                    style={{ marginTop: 12 }}
                    onClick={generateLocalSuggestion}
                  >
                    ✧ اقترحي لي فكرة
                  </button>

                  {aiSuggestion && (
                    <div className="ai-result">
                      <strong>اقتراح روشان:</strong>
                      <p>{aiSuggestion}</p>
                      <button
                        className="secondary-btn"
                        onClick={() => {
                          setProjectName("تصميم مقترح من روشان");
                          setPage("editor");
                        }}
                      >
                        ابدئي التصميم بهذا الاقتراح
                      </button>
                    </div>
                  )}

                  <p className="hint" style={{ marginTop: 20 }}>
                    هذه نسخة أولية من المساعد تعتمد على اقتراحات محلية. توليد الصور بالذكاء الاصطناعي
                    وتحليل الصور فعلياً يحتاج إلى ربط خدمة AI عبر API وخادم آمن.
                  </p>
                </>
              )}

              {page === "pinterest" && (
                <>
                  <section className="pinterest-banner">
                    <h2>ابحثي عن إلهامك ✧</h2>
                    <p>استكشفي أفكار الدعوات والتنسيقات والخامات من Pinterest.</p>
                  </section>

                  <div className="section-head">
                    <h2>البحث في Pinterest</h2>
                  </div>

                  <input
                    className="search-input"
                    placeholder="مثلاً: elegant wedding invitation"
                    value={pinterestSearch}
                    onChange={(e) => setPinterestSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") openPinterest();
                    }}
                  />

                  <button
                    className="primary-btn"
                    style={{ marginTop: 12 }}
                    onClick={openPinterest}
                  >
                    فتح نتائج Pinterest ↗
                  </button>

                  <div className="ai-result">
                    <strong>كيف تستخدمين الصور؟</strong>
                    <p>
                      افتحي Pinterest وابحثي عن المرجع الذي يعجبك، ثم احفظي الصورة على جهازك.
                      ارجعي إلى روشان، ارفعي الصورة من مكتبة العناصر، واستخدمي أداة إزالة الخلفية
                      لإضافة العنصر إلى تصميمك.
                    </p>
                  </div>

                  <p className="hint" style={{ marginTop: 15 }}>
                    البحث يفتح موقع Pinterest. الربط المباشر بالحساب واستيراد الصور داخلياً يحتاج
                    إلى تكامل رسمي وصلاحيات API.
                  </p>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {showNew && (
        <div className="modal-backdrop" onClick={() => setShowNew(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>تصميم جديد</h2>
            <label className="field-label">اسم المشروع</label>
            <input
              className="text-input"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="مثلاً: دعوة زواج..."
            />
            <div className="modal-actions">
              <button className="primary-btn" onClick={createProject}>إنشاء التصميم</button>
              <button className="secondary-btn" onClick={() => setShowNew(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TemplateCard({
  item,
  onChoose,
}: {
  item: typeof templates[0];
  onChoose: () => void;
}) {
  return (
    <div className="template-card">
      <div className={`preview ${item.style}`}>
        {item.tag && <span className="tag">{item.tag}</span>}
        <div className="invite-paper">
          <div className="invite-ornament">✧ ❀ ✧</div>
          <div className="invite-title">{item.title}</div>
          <div className="invite-small">دعوة بكل حب</div>
          <div className="invite-ornament" style={{ marginTop: 10 }}>❦</div>
        </div>
      </div>
      <div className="card-info">
        <div>
          <strong>{item.title}</strong>
          <small>{item.type} · قالب قابل للتعديل</small>
        </div>
        <button className="edit-link" onClick={onChoose}>
          استخدمي القالب ↗
        </button>
      </div>
    </div>
  );
}
export default App;