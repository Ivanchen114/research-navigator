cat << 'INNER_EOF' > /tmp/home_replacement.txt
          {/* Phase 2 研究規劃 W5–W8 */}
          <div className="phase">
            <div className="phase-head">
              <span className="ph-num">Phase 02</span>
              <span className="ph-divider"></span>
              <span className="ph-title">研究規劃</span>
              <span className="ph-range">W5 – W8</span>
            </div>
            <div className="week-grid wg-4">
              <WeekCard num="W5" icon={<Search size={18} className="text-[#9090b0]" />} title="文獻搜尋入門" desc="掌握資料庫手動檢索與精準標註 APA 證物標籤。" path="/w5" />
              <WeekCard num="W6" icon={<BookOpen size={18} className="text-[#9090b0]" />} title="文獻偵探社" desc="寫出真正的文獻探討，拆解與組合文獻線索。" path="/w6" mission={{ tag: 'MISSION', name: '行動代號：獵狐', path: '/game/citation-detective' }} />
              <WeekCard num="W7" icon={<Stethoscope size={18} className="text-[#9090b0]" />} title="研究診所" desc="依研究方法分流，深入學習各方法特性。" path="/w7" mission={{ tag: 'GEAR', name: '行動代號：裝備', path: '/game/tool-quiz' }} />
              <WeekCard num="W8" icon={<Users size={18} className="text-[#9090b0]" />} title="組隊決策週" desc="找能力互補的夥伴，或宣告 Solo 研究。" path="/w8" />
            </div>
          </div>

          {/* Phase 3 裝備執行 W9–W13 */}
          <div className="phase">
            <div className="phase-head">
              <span className="ph-num">Phase 03</span>
              <span className="ph-divider"></span>
              <span className="ph-title">裝備執行</span>
              <span className="ph-range">W9 – W13</span>
            </div>
            <div className="week-grid wg-5">
              <WeekCard num="W9" icon={<Wrench size={18} className="text-[#9090b0]" />} title="工具設計" desc="問卷、訪談、實驗各組深化工具設計。" path="/tool-design" mission={{ tag: 'MISSION', name: '行動代號：防線', path: '/game/rx-inspector' }} />
              <WeekCard num="W10" icon={<Microscope size={18} className="text-[#9090b0]" />} title="工具精進" desc="AI 審稿 + 人工預試雙重把關，工具定稿。" path="/tool-refinement" />
              <WeekCard num="W11" icon={<FlaskConical size={18} className="text-[#9090b0]" />} title="倫理審查" desc="四問自查、知情同意書 AI 審查、蓋章出發。" path="/w11" />
              <ImplWeek num="W12" title="研究執行 I" desc="Open Office 執行週，資料蒐集第一週。" />
              <ImplWeek num="W13" title="研究執行 II" desc="中期進度盤點，最後衝刺，資料收齊。" />
            </div>
          </div>

          {/* Phase 4 分析報告 W14–W17 */}
          <div className="phase">
            <div className="phase-head">
              <span className="ph-num">Phase 04</span>
              <span className="ph-divider"></span>
              <span className="ph-title">分析報告</span>
              <span className="ph-range">W14 – W17</span>
            </div>
            <div className="week-grid wg-4">
              <WeekCard num="W14" icon={<BarChart2 size={18} className="text-[#9090b0]" />} title="數據轉譯" desc="四大圖表選擇、格式規範、描述＋詮釋寫作。" path="/w14" mission={{ tag: 'DECADE', name: '行動代號：解碼', path: '/game/chart-matcher' }} />
              <WeekCard num="W15" icon={<FileText size={18} className="text-[#9090b0]" />} title="研究結論" desc="四層結論寫作：描述、詮釋、回扣文獻、批判限制。" path="/w15" mission={{ tag: 'FILTER', name: '行動代號：濾鏡', path: '/game/data-detective' }} />
              <WeekCard num="W16" icon={<Palette size={18} className="text-[#9090b0]" />} title="簡報與海報" desc="七章報告組裝、AI 潤色縫合、海報設計。" path="/w16" />
              <WeekCard num="W17" icon={<Trophy size={18} className="text-[#9090b0]" />} title="成果發表" desc="策展人登場，A/B 組輪替，學術投資貼紙。" path="/w17" />
            </div>
          </div>
INNER_EOF

# Count lines 479 to 539 -> replacing this block. Let's make sure sed command does the right thing. Wait, the exact block might end at varying lines depending on the corruption.
