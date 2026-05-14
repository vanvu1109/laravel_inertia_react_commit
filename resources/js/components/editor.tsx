import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoFocusExtension, ClearEditorExtension, DecoratorTextExtension, HorizontalRuleExtension, SelectionAlwaysOnDisplayExtension } from "@lexical/extension";
import { HistoryExtension } from "@lexical/history";
import { AutoLinkExtension, ClickableLinkExtension, LinkExtension } from "@lexical/link";
import { CheckListExtension, ListExtension } from "@lexical/list";
import { CHECK_LIST, ELEMENT_TRANSFORMERS, MULTILINE_ELEMENT_TRANSFORMERS, TEXT_FORMAT_TRANSFORMERS, TEXT_MATCH_TRANSFORMERS } from "@lexical/markdown";
import { OverflowNode } from "@lexical/overflow";
import { CharacterLimitPlugin } from "@lexical/react/LexicalCharacterLimitPlugin";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { RichTextExtension } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { type EditorState, type SerializedEditorState, configExtension, defineExtension } from "lexical";
import { useEffect, useMemo, useState } from "react";

// import { useBlockViewer } from "@/components/block-viewer-provider";
import { ContentEditable } from "@/components/content-editable";
import { DateTimeExtension } from "@/components/date-time-extension";
import { EmojisExtension } from "@/components/emojis-extension";
import { ImagesExtension } from "@/components/images-extension";
import { MarkdownShortcutsExtension } from "@/components/markdown-shortcuts-extension";
import { MaxLengthExtension } from "@/components/max-length-extension";
import { AutocompleteNode } from "@/components/autocomplete-node";
import { TweetNode } from "@/components/tweet-node";
import { YouTubeNode } from "@/components/youtube-node";
import { EmojiNode } from "@/components/emoji-node";
import { LayoutContainerNode } from "@/components/layout-container-node";
import { LayoutItemNode } from "@/components/layout-item-node";
import { MentionNode } from "@/components/mention-node";
import { SpecialTextNode } from "@/components/special-text-node";
import { ActionsPlugin } from "@/components/actions-plugin";
import { ClearEditorActionPlugin } from "@/components/clear-editor-plugin";
import { CounterCharacterPlugin } from "@/components/counter-character-plugin";
import { EditModeTogglePlugin } from "@/components/edit-mode-toggle-plugin";
import { ImportExportPlugin } from "@/components/import-export-plugin";
import { MarkdownTogglePlugin } from "@/components/markdown-toggle-plugin";
import { ShareContentPlugin } from "@/components/share-content-plugin";
import { SpeechToTextPlugin } from "@/components/speech-to-text-plugin";
import { TreeViewPlugin } from "@/components/tree-view-plugin";
import { AutoCompletePlugin } from "@/components/auto-complete-plugin";
import { CodeActionMenuPlugin } from "@/components/code-action-menu-plugin";
import { CodeHighlightPlugin } from "@/components/code-highlight-plugin";
import { ComponentPickerMenuPlugin } from "@/components/component-picker-menu-plugin";
import { ContextMenuPlugin } from "@/components/context-menu-plugin";
import { DraggableBlockPlugin } from "@/components/draggable-block-plugin";
import { AutoEmbedPlugin } from "@/components/auto-embed-plugin";
import { TwitterPlugin } from "@/components/twitter-plugin";
import { YouTubePlugin } from "@/components/youtube-plugin";
import { EmojiPickerPlugin } from "@/components/emoji-picker-plugin";
import { FloatingLinkEditorPlugin } from "@/components/floating-link-editor-plugin";
import { FloatingTextFormatToolbarPlugin } from "@/components/floating-text-format-plugin";
import { LayoutPlugin } from "@/components/layout-plugin";
import { MentionsPlugin } from "@/components/mentions-plugin";
// import { DateTimePickerPlugin } from "@/components/date-time-picker-plugin";
// import { EmbedsPickerPlugin } from "@/components/embeds-picker-plugin";
import { SpecialTextPlugin } from "@/components/special-text-plugin";
import { TabFocusPlugin } from "@/components/tab-focus-plugin";
import { BlockFormatDropDown } from "@/components/block-format-toolbar-plugin";
import { FormatBulletedList } from "@/components/format-bulleted-list";
import { FormatCheckList } from "@/components/format-check-list";
import { FormatCodeBlock } from "@/components/format-code-block";
import { FormatHeading } from "@/components/format-heading";
import { FormatNumberedList } from "@/components/format-numbered-list";
import { FormatParagraph } from "@/components/format-paragraph";
import { FormatQuote } from "@/components/format-quote";
import { BlockInsertPlugin } from "@/components/block-insert-plugin";
import { InsertColumnsLayout } from "@/components/insert-columns-layout";
import { InsertEmbeds } from "@/components/insert-embeds";
import { InsertHorizontalRule } from "@/components/insert-horizontal-rule";
import { InsertImage } from "@/components/insert-image";
import { InsertTable } from "@/components/insert-table";
import { ClearFormattingToolbarPlugin } from "@/components/clear-formatting-toolbar-plugin";
import { CodeLanguageToolbarPlugin } from "@/components/code-language-toolbar-plugin";
import { ElementFormatToolbarPlugin } from "@/components/element-format-toolbar-plugin";
import { FontBackgroundToolbarPlugin } from "@/components/font-background-toolbar-plugin";
import { FontColorToolbarPlugin } from "@/components/font-color-toolbar-plugin";
import { FontFamilyToolbarPlugin } from "@/components/font-family-toolbar-plugin";
import { FontFormatToolbarPlugin } from "@/components/font-format-toolbar-plugin";
import { FontSizeToolbarPlugin } from "@/components/font-size-toolbar-plugin";
import { HistoryToolbarPlugin } from "@/components/history-toolbar-plugin";
import { LinkToolbarPlugin } from "@/components/link-toolbar-plugin";
import { SubSuperToolbarPlugin } from "@/components/subsuper-toolbar-plugin";
import { ToolbarPlugin } from "@/components/toolbar-plugin";
import { editorTheme } from "@/components/editor-theme";
import { EMOJI } from "@/components/markdown-emoji-transformer";
import { HR } from "@/components/markdown-hr-transformer";
import { IMAGE } from "@/components/markdown-image-transformer";
import { TABLE } from "@/components/markdown-table-transformer";
import { TWEET } from "@/components/markdown-tweet-transformer";
import { validateUrl } from "@/components/url";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";

const placeholder = "Press / for commands...";
const maxLength = 30;

interface EditorProps {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  name: string;
  value: string | undefined;
  height?: string;
}

export function Editor({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  name,
  value,
  height
}: EditorProps) {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const [content, setContent] = useState(value || "");
  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };
  const [ready, setReady] = useState(false)

useEffect(() => {
  setReady(true)
}, [])
  
  const AppExtension = useMemo(() =>
      defineExtension({
        dependencies: [
          RichTextExtension,
          AutoFocusExtension,
          // SelectionAlwaysOnDisplayExtension,
          HistoryExtension,
          configExtension(LinkExtension, {
            validateUrl,
            attributes: { rel: "noopener noreferrer", target: "_blank" },
          }),
          AutoLinkExtension,
          ClickableLinkExtension,
          configExtension(MaxLengthExtension, { disabled: false, maxLength }),
          configExtension(MarkdownShortcutsExtension, {
            transformers: [
              TABLE, HR, IMAGE, EMOJI, TWEET, CHECK_LIST,
              ...ELEMENT_TRANSFORMERS,
              ...MULTILINE_ELEMENT_TRANSFORMERS,
              ...TEXT_FORMAT_TRANSFORMERS,
              ...TEXT_MATCH_TRANSFORMERS,
            ],
          }),
          ClearEditorExtension,
          EmojisExtension,
          DecoratorTextExtension,
          configExtension(ListExtension, { shouldPreserveNumbering: false }),
          CheckListExtension,
          HorizontalRuleExtension,
          ImagesExtension,
          DateTimeExtension,
        ],
        name: "@shadcn-editor",
        namespace: name,
        nodes: [
          OverflowNode,
          EmojiNode,
          MentionNode,
          AutocompleteNode,
          SpecialTextNode,
          CodeNode,
          CodeHighlightNode,
          TableNode,
          TableCellNode,
          TableRowNode,
          LayoutContainerNode,
          LayoutItemNode,
          TweetNode,
          YouTubeNode,
        ],
        $initialEditorState(editor) {
          if (editorSerializedState) {
            editor.parseEditorState(editorSerializedState);
          } else if (editorState) {
            editor.setEditorState(editorState);
          } else if (value) {
            editor.update(() => {
              const root = $getRoot();
              root.clear();
              const paragraph = $createParagraphNode();
              paragraph.append($createTextNode(value));
              root.append(paragraph);
            });
          }
        },
        theme: editorTheme,
      }),
    [editorState, editorSerializedState, name],
  );

  return (
    <div className="bg-background overflow-hidden rounded-lg border shadow w-full">
      <input type="hidden" name={name} value={content} />
      <LexicalExtensionComposer extension={AppExtension} contentEditable={null}>
        <TooltipProvider>
          <div className="relative">
            <ToolbarPlugin>
              {({ blockType }) => (
                <div className="vertical-align-middle sticky top-0 z-10 flex items-center gap-2 overflow-auto border-b p-1">
                  <HistoryToolbarPlugin />
                  <Separator orientation="vertical" className="h-7!" />
                  <BlockFormatDropDown>
                    <FormatParagraph />
                    <FormatHeading levels={["h1", "h2", "h3"]} />
                    <FormatNumberedList />
                    <FormatBulletedList />
                    <FormatCheckList />
                    <FormatCodeBlock />
                    <FormatQuote />
                  </BlockFormatDropDown>
                  {blockType === "code" ? (
                    <CodeLanguageToolbarPlugin />
                  ) : (
                    <>
                    <FontFamilyToolbarPlugin />
                    <Separator orientation="vertical" className="h-7!" />
                    <FontSizeToolbarPlugin />
                    <FontFormatToolbarPlugin />
                    <SubSuperToolbarPlugin />
                    <LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
                    <ClearFormattingToolbarPlugin />
                    <FontColorToolbarPlugin />
                    <FontBackgroundToolbarPlugin />
                    <ElementFormatToolbarPlugin />
                    <BlockInsertPlugin>
                      <InsertHorizontalRule />
                      <InsertImage />
                      <InsertTable />
                      <InsertColumnsLayout />
                      <InsertEmbeds />
                    </BlockInsertPlugin>
                    </>
                  )}
                </div>
              )}
            </ToolbarPlugin>
            <div className="relative">
              <div className="">
                <div className="" ref={onRef}>
                  <ContentEditable
                    placeholder={placeholder}
                    className={`pl-4 ${height ? height : "h-[calc(100vh-141px)]"}`}
                  />
                </div>
              </div>
              <ComponentPickerMenuPlugin baseOptions={[]} />
              <EmojiPickerPlugin />
              <AutoEmbedPlugin />
              <MentionsPlugin />
              <AutoCompletePlugin />
              <ContextMenuPlugin />
              <SpecialTextPlugin />
              <TabFocusPlugin />
              <TabIndentationPlugin />
              <CodeHighlightPlugin />
              <TablePlugin />
              <LayoutPlugin />
              <TwitterPlugin />
              <YouTubePlugin />
              {/* <DraggableBlockPlugin anchorElem={floatingAnchorElem} baseOptions={[]} /> */}
              {ready && floatingAnchorElem && (
                <>
                  <FloatingTextFormatToolbarPlugin
                    anchorElem={floatingAnchorElem}
                    setIsLinkEditMode={setIsLinkEditMode}
                  />
                  <FloatingLinkEditorPlugin
                    anchorElem={floatingAnchorElem}
                    isLinkEditMode={isLinkEditMode}
                    setIsLinkEditMode={setIsLinkEditMode}
                  />
                </>
              )}
            </div>
            {/* <ActionsPlugin>
              <div className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1">
                <div className="flex flex-1 justify-start text-xs text-gray-500">
                  <CharacterLimitPlugin maxLength={maxLength} charset="UTF-16" />
                </div>
                <div>
                <CounterCharacterPlugin charset="UTF-16" />
                </div>
                <div className="flex flex-1 justify-end">
                  <SpeechToTextPlugin />
                  <ShareContentPlugin />
                  <ImportExportPlugin />
                  <MarkdownTogglePlugin
                    shouldPreserveNewLinesInMarkdown={true}
                    transformers={[
                      TABLE, HR, IMAGE, EMOJI, TWEET, CHECK_LIST,
                      ...ELEMENT_TRANSFORMERS,
                      ...MULTILINE_ELEMENT_TRANSFORMERS,
                      ...TEXT_FORMAT_TRANSFORMERS,
                      ...TEXT_MATCH_TRANSFORMERS,
                    ]}
                  />
                  <EditModeTogglePlugin />
                  <ClearEditorActionPlugin />
                  <TreeViewPlugin />
                </div>
              </div>
            </ActionsPlugin> */}
          </div>

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onChange?.(editorState);

              const json = editorState.toJSON();
              onSerializedChange?.(json);

              // 👇 convert sang string để submit
              setContent(JSON.stringify(json));
            }}
          />
        </TooltipProvider>
      </LexicalExtensionComposer>
    </div>
  );
}