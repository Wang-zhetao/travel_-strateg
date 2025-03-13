import React, { useState, useEffect, useRef } from 'react';
import {
  DocumentTextIcon,
  LinkIcon,
  PhotoIcon,
  CodeBracketIcon,
  ListBulletIcon,
  HashtagIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

interface MarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  content,
  onChange,
  placeholder = '在这里编写内容...',
}) => {
  const [text, setText] = useState(content);
  const [previewMode, setPreviewMode] = useState(false);
  const [stats, setStats] = useState({
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  });
  const [analysisDetails, setAnalysisDetails] = useState({
    longSentences: [] as number[],
    complexWords: [] as number[],
    passiveVoices: [] as number[],
    adverbs: [] as number[],
  });
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(content);
  }, [content]);

  useEffect(() => {
    analyzeText(text);
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onChange(newText);
  };

  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    if (!editorRef.current) return;

    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    let insertedText;
    if (selectedText) {
      insertedText = syntax.replace('$1', selectedText);
    } else {
      insertedText = syntax.replace('$1', placeholder);
    }

    const newText = beforeText + insertedText + afterText;
    setText(newText);
    onChange(newText);

    // 设置光标位置
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = selectedText
        ? start + insertedText.length - selectedText.length
        : start + insertedText.indexOf(placeholder) + placeholder.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const analyzeText = (text: string) => {
    // 基本统计
    const words = text.split(/\s+/).filter(Boolean).length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(words / 200)); // 假设阅读速度为每分钟200词

    setStats({
      words,
      sentences,
      paragraphs,
      readingTime,
    });

    // 文本分析
    const longSentences: number[] = [];
    const complexWords: number[] = [];
    const passiveVoices: number[] = [];
    const adverbs: number[] = [];

    // 简单分析示例
    // 检测长句子
    const allSentences = text.split(/[.!?]+/).filter(Boolean);
    allSentences.forEach((sentence, index) => {
      const wordCount = sentence.split(/\s+/).filter(Boolean).length;
      if (wordCount > 15) longSentences.push(index);
    });

    // 检测复杂词汇（简单示例）
    const words_array = text.split(/\s+/).filter(Boolean);
    const complexWordRegex = /\b\w{7,}\b/g;
    let match;
    let globalIndex = 0;
    words_array.forEach((word, index) => {
      if (complexWordRegex.test(word)) {
        complexWords.push(globalIndex + index);
      }
    });

    // 检测被动语态（简单示例）
    const passiveRegex = /\b(is|are|was|were|be|been|being)\s+(\w+ed|\w+en)\b/gi;
    let passiveMatch;
    while ((passiveMatch = passiveRegex.exec(text)) !== null) {
      passiveVoices.push(passiveMatch.index);
    }

    // 检测副词（简单示例）
    const adverbRegex = /\b\w+ly\b/gi;
    let adverbMatch;
    while ((adverbMatch = adverbRegex.exec(text)) !== null) {
      adverbs.push(adverbMatch.index);
    }

    setAnalysisDetails({
      longSentences,
      complexWords,
      passiveVoices,
      adverbs,
    });
  };

  const renderPreview = () => {
    // 简单的Markdown解析
    let html = text;
    
    // 处理标题
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold my-3">$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold my-4">$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold my-5">$1</h1>');
    
    // 处理粗体和斜体
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 处理链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
    
    // 处理图片
    html = html.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="my-4 rounded-lg max-w-full">');
    
    // 处理列表
    html = html.replace(/^\s*-\s*(.*$)/gm, '<li class="ml-4">$1</li>');
    html = html.replace(/^\s*\d+\.\s*(.*$)/gm, '<li class="ml-4 list-decimal">$1</li>');
    
    // 处理代码块
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg my-3 overflow-x-auto"><code>$1</code></pre>');
    
    // 处理行内代码
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>');
    
    // 处理分隔线
    html = html.replace(/^\s*---\s*$/gm, '<hr class="my-4 border-t border-gray-300">');
    
    // 处理段落
    html = html.replace(/^\s*(.+)$/gm, (match) => {
      if (
        !match.startsWith('<h') && 
        !match.startsWith('<li') && 
        !match.startsWith('<pre') && 
        !match.startsWith('<hr')
      ) {
        return `<p class="my-2">${match}</p>`;
      }
      return match;
    });
    
    // 将连续的列表项包装在ul或ol中
    html = html.replace(/<li class="ml-4">[\s\S]*?<\/li>/g, '<ul class="list-disc my-3 pl-5">$&</ul>');
    html = html.replace(/<li class="ml-4 list-decimal">[\s\S]*?<\/li>/g, '<ol class="list-decimal my-3 pl-5">$&</ol>');
    
    // 修复嵌套的ul和ol
    html = html.replace(/<\/ul>\s*<ul[^>]*>/g, '');
    html = html.replace(/<\/ol>\s*<ol[^>]*>/g, '');
    
    return (
      <div
        className="prose max-w-none p-4 rounded-lg bg-white min-h-[300px]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  const renderHighlightedText = () => {
    return text;
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* 工具栏 */}
      <div className="bg-gray-50 p-2 border-b border-gray-200 flex flex-wrap items-center">
        <div className="flex space-x-1 mr-4">
          <button
            onClick={() => insertMarkdown('# $1', '标题')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
            title="大标题"
          >
            <HashtagIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => insertMarkdown('## $1', '二级标题')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
            title="中标题"
          >
            <span className="font-bold text-sm">H2</span>
          </button>
          <button
            onClick={() => insertMarkdown('### $1', '三级标题')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
            title="小标题"
          >
            <span className="font-bold text-sm">H3</span>
          </button>
        </div>

        <div className="flex space-x-1 mr-4">
          <button
            onClick={() => insertMarkdown('**$1**', '粗体文本')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
            title="粗体"
          >
            <span className="font-bold">B</span>
          </button>
          <button
            onClick={() => insertMarkdown('*$1*', '斜体文本')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
            title="斜体"
          >
            <span className="italic">I</span>
          </button>
          <button
            onClick={() => insertMarkdown('~~$1~~', '删除线文本')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
            title="删除线"
          >
            <span className="line-through">S</span>
          </button>
        </div>

        <div className="flex space-x-1 mr-4">
          <button
            onClick={() => insertMarkdown('[$1](https://example.com)', '链接文本')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
            title="链接"
          >
            <LinkIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => insertMarkdown('![图片描述](https://example.com/image.jpg)', '图片描述')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
            title="图片"
          >
            <PhotoIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex space-x-1 mr-4">
          <button
            onClick={() => insertMarkdown('- $1\n- 项目二\n- 项目三', '项目一')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
            title="无序列表"
          >
            <ListBulletIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => insertMarkdown('1. $1\n2. 项目二\n3. 项目三', '项目一')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
            title="有序列表"
          >
            <span className="font-mono font-bold">1.</span>
          </button>
        </div>

        <div className="flex space-x-1 mr-4">
          <button
            onClick={() => insertMarkdown('```\n$1\n```', '代码块')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
            title="代码块"
          >
            <CodeBracketIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => insertMarkdown('> $1', '引用文本')}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
            title="引用"
          >
            <span className="font-serif text-lg">&ldquo;</span>
          </button>
        </div>

        <div className="ml-auto flex items-center">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-3 py-1.5 rounded flex items-center ${previewMode ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
          >
            <DocumentTextIcon className="h-4 w-4 mr-1" />
            {previewMode ? '返回编辑' : '预览'}
          </button>
        </div>
      </div>

      {/* 编辑器主体 */}
      <div className="flex flex-col md:flex-row">
        {/* 文本编辑区 */}
        {!previewMode ? (
          <div className="flex-grow relative">
            <textarea
              ref={editorRef}
              value={text}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full min-h-[300px] p-4 resize-y border-0 focus:ring-0 focus:outline-none"
            />
            {/* 文本分析UI覆盖层（可以在这里添加句子高亮等功能） */}
          </div>
        ) : (
          /* 预览模式 */
          <div className="flex-grow">{renderPreview()}</div>
        )}
      </div>

      {/* 文本统计和分析结果 */}
      <div className="bg-gray-50 p-3 border-t border-gray-200 flex flex-wrap justify-between items-center text-sm text-gray-600">
        <div className="flex space-x-4">
          <span>{stats.words} 词</span>
          <span>{stats.sentences} 句</span>
          <span>{stats.paragraphs} 段</span>
          <span>阅读时间：约 {stats.readingTime} 分钟</span>
        </div>
        <div className="flex space-x-3">
          {analysisDetails.longSentences.length > 0 && (
            <span className="text-amber-600">
              {analysisDetails.longSentences.length} 个长句
            </span>
          )}
          {analysisDetails.complexWords.length > 0 && (
            <span className="text-purple-600">
              {analysisDetails.complexWords.length} 个复杂词汇
            </span>
          )}
          {analysisDetails.passiveVoices.length > 0 && (
            <span className="text-blue-600">
              {analysisDetails.passiveVoices.length} 处被动语态
            </span>
          )}
          {analysisDetails.adverbs.length > 0 && (
            <span className="text-green-600">
              {analysisDetails.adverbs.length} 个副词
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
