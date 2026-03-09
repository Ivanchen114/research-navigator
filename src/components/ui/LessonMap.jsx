import React from 'react';
import './LessonMap.css'; // We'll put the specific timeline CSS here.

export const LessonMap = ({ data }) => {
    if (!data) return null;

    return (
        <div className="lesson-map-page">
            {/* Title Bar */}
            <div className="lm-title-bar">
                <span className="lm-title-tag">{data.id} LESSON MAP</span>
                <h1 className="lm-title-text">{data.title}</h1>
                <div className="lm-sub">{data.duration} min {data.durationDesc ? `÷ ${data.durationDesc}` : ''}</div>
            </div>

            {/* Core Concepts Box */}
            {data.coreConcepts && (
                <div className="lm-core-box">
                    <div className="lm-core-box-title">🎯 本節核心概念</div>
                    {data.coreConcepts.map((concept, idx) => (
                        <div key={idx} className={`lm-core-item ${concept.colorConfig || 'r'}`}>
                            <strong>{concept.prefix} {concept.title}</strong><br />
                            {concept.subtitle && (
                                <>
                                    {concept.subtitle}<br />
                                </>
                            )}
                            {concept.desc && <small>{concept.desc}</small>}
                        </div>
                    ))}
                </div>
            )}

            {/* Timeline Periods */}
            {data.periods && data.periods.map((period, pIdx) => (
                <React.Fragment key={pIdx}>
                    <div className="lm-period-header">
                        <span className="lm-period-badge">{period.badge}</span>
                        {period.title}
                        <span className="lm-period-time">{period.duration} min</span>
                    </div>

                    <div className="lm-timeline">
                        {period.stages && period.stages.map((stage, sIdx) => {
                            const isLast = sIdx === period.stages.length - 1;
                            return (
                                <div key={sIdx} className={`lm-stage ${stage.colorClass || 'c1'}`}>
                                    <div className="lm-stage-time">
                                        {stage.timeStart}<br />↓<br />{stage.timeEnd}
                                    </div>
                                    <div className="lm-stage-line">
                                        <div className="lm-stage-dot"></div>
                                        {!isLast && <div className="lm-stage-connector"></div>}
                                    </div>
                                    <div className="lm-stage-card">
                                        <div className="lm-stage-duration">{stage.duration}</div>
                                        <div className="lm-stage-card-inner">
                                            <div className="lm-stage-icon">{stage.icon}</div>
                                            <div className="lm-stage-content">
                                                <div className="lm-stage-title">{stage.title}</div>
                                                <div className="lm-stage-desc" dangerouslySetInnerHTML={{ __html: stage.desc }} />
                                                {stage.tags && (
                                                    <div className="lm-stage-tags">
                                                        {stage.tags.map((tag, tIdx) => (
                                                            <span key={tIdx} className="lm-tag">{tag}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                {stage.keyPoint && (
                                                    <div className="lm-key-point" dangerouslySetInnerHTML={{ __html: stage.keyPoint }} />
                                                )}
                                                {stage.additionalNotes && (
                                                    <div className="mt-2 text-xs bg-white border border-dashed rounded p-1.5"
                                                        style={{ borderColor: `var(--${stage.colorClass || 'c1'})` }} dangerouslySetInnerHTML={{ __html: stage.additionalNotes }} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Break Bar (if specified after a period, and not the last period usually) */}
                    {period.hasBreakAfter && (
                        <div className="lm-break-bar">
                            <div className="lm-dash"></div>
                            ☕ 課間休息 10 分鐘
                            <div className="lm-dash"></div>
                        </div>
                    )}
                </React.Fragment>
            ))}

            {/* Summary Row */}
            {data.summaries && (
                <div className="lm-summary-row">
                    {data.summaries.map((sum, idx) => (
                        <div key={idx} className={`lm-sum-card ${idx === data.summaries.length - 1 ? 'last-sum-card' : ''}`}>
                            <div className="lm-sum-icon">{sum.icon}</div>
                            <div className="lm-sum-label">{sum.label}</div>
                            <div className="lm-sum-text" dangerouslySetInnerHTML={{ __html: sum.text }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Legend */}
            <div className="lm-legend">
                <div className="lm-legend-title">COLOR LEGEND</div>
                {data.legends && data.legends.map((legend, idx) => (
                    <div key={idx} className="lm-legend-item">
                        <div className="lm-legend-dot" style={{ background: `var(--${legend.colorClass})` }}></div>
                        <span>{legend.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LessonMap;
