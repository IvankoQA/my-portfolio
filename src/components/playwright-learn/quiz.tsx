"use client"

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import type { AppLocale } from "@/lib/i18n/locale"
import { recordTopicQuizSubmission } from "@/lib/playwright-learn/storage"
import { stripDocsImportMarkers } from "@/lib/playwright-learn/strip-docs-import-markers"
import type { QuizQuestion } from "@/lib/playwright-learn/types"
import { renderInlineMarkdown } from "./inline-markdown"
import { CheckIcon, XIcon } from "./icons"

type Phase = "editing" | "review"

function quizRichText(raw: string, key: string) {
  return renderInlineMarkdown(stripDocsImportMarkers(raw) ?? "", key)
}

type Props = {
  slug: string
  questions: QuizQuestion[]
  locale: AppLocale
}

const STRINGS = {
  en: {
    title: "Check yourself",
    intro:
      "Answer every question, then submit to see what was right, what wasn't, and the full reasoning for each one.",
    submit: "Submit answers",
    retry: "Try again",
    correctBadge: "Correct",
    wrongBadge: "Incorrect",
    yourAnswer: "Your answer",
    correctAnswer: "Correct answer",
    rationale: "Why this is the correct answer",
    summary: (correct: number, total: number) =>
      `${correct} of ${total} correct.`,
    summaryLive: (correct: number, total: number) =>
      `Quiz submitted. ${correct} of ${total} questions correct. Review your answers below.`,
    missing: "Please answer every question before submitting.",
    emptyBody: "There are no quiz questions for this topic yet.",
  },
  uk: {
    title: "Перевір себе",
    intro:
      "Дай відповідь на всі питання й натисни «Надіслати». Після цього побачиш, що було правильно, що ні, і повне пояснення для кожного питання.",
    submit: "Надіслати відповіді",
    retry: "Пройти ще раз",
    correctBadge: "Вірно",
    wrongBadge: "Невірно",
    yourAnswer: "Твоя відповідь",
    correctAnswer: "Правильна відповідь",
    rationale: "Чому це правильна відповідь",
    summary: (correct: number, total: number) =>
      `${correct} з ${total} правильно.`,
    summaryLive: (correct: number, total: number) =>
      `Тест надіслано. ${correct} з ${total} правильних відповідей. Подивись результати нижче.`,
    missing: "Будь ласка, дай відповідь на всі питання перед сабмітом.",
    emptyBody: "Для цієї теми ще немає питань тесту.",
  },
} as const

export function Quiz({ slug, questions, locale }: Props) {
  const t = STRINGS[locale]
  const [phase, setPhase] = useState<Phase>("editing")
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const reportRef = useRef<HTMLDivElement | null>(null)
  const liveRef = useRef<HTMLDivElement | null>(null)
  const formId = useId()

  const total = questions.length
  const correctCount = useMemo(() => {
    if (phase !== "review") return 0
    return questions.reduce(
      (acc, q) => (answers[q.id] === q.correctOptionId ? acc + 1 : acc),
      0,
    )
  }, [phase, questions, answers])

  const onPick = useCallback(
    (questionId: string, optionId: string) => {
      if (phase === "review") return
      setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
      if (error) setError(null)
    },
    [phase, error],
  )

  const onSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()
      const missing = questions.find((q) => !answers[q.id])
      if (missing) {
        setError(t.missing)
        return
      }
      const correct = questions.reduce(
        (acc, q) => (answers[q.id] === q.correctOptionId ? acc + 1 : acc),
        0,
      )
      recordTopicQuizSubmission(slug, { correct, total: questions.length })
      setPhase("review")
    },
    [questions, answers, slug, t.missing],
  )

  const onRetry = useCallback(() => {
    setAnswers({})
    setPhase("editing")
    setError(null)
  }, [])

  useEffect(() => {
    if (phase !== "review") return
    if (reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    if (liveRef.current) {
      liveRef.current.textContent = t.summaryLive(correctCount, total)
    }
  }, [phase, correctCount, total, t])

  if (questions.length === 0) {
    return (
      <section
        aria-labelledby={`${formId}-title`}
        style={{
          marginTop: 48,
          paddingTop: 28,
          borderTop: "1px solid var(--line)",
        }}
      >
        <h2
          id={`${formId}-title`}
          style={{
            fontSize: 22,
            fontWeight: 600,
            margin: 0,
            color: "var(--ink)",
          }}
        >
          {t.title}
        </h2>
        <p style={{ color: "var(--ink-2)", marginTop: 10, fontSize: 15 }}>
          {t.emptyBody}
        </p>
      </section>
    )
  }

  return (
    <section
      aria-labelledby={`${formId}-title`}
      style={{
        marginTop: 48,
        paddingTop: 28,
        borderTop: "1px solid var(--line)",
      }}
    >
      <h2
        id={`${formId}-title`}
        style={{
          fontSize: 22,
          fontWeight: 600,
          margin: 0,
          color: "var(--ink)",
        }}
      >
        {t.title}
      </h2>
      <p style={{ color: "var(--ink-3)", marginTop: 6, fontSize: 14 }}>
        {t.intro}
      </p>

      <div
        ref={liveRef}
        role="status"
        aria-live="polite"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      />

      {phase === "review" ? (
        <div
          ref={reportRef}
          aria-live="polite"
          style={{
            marginTop: 16,
            padding: "12px 14px",
            border: "1px solid var(--line)",
            borderRadius: 10,
            background: "var(--bg-tile)",
            fontSize: 14,
            color: "var(--ink)",
            fontWeight: 500,
          }}
        >
          {t.summary(correctCount, total)}
        </div>
      ) : null}

      <form onSubmit={onSubmit} noValidate style={{ marginTop: 16 }}>
        <ol
          style={{
            listStyle: "decimal",
            paddingLeft: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {questions.map((q, qIndex) => {
            const selected = answers[q.id]
            const isCorrect =
              phase === "review" && selected === q.correctOptionId
            const isWrong = phase === "review" && selected !== q.correctOptionId
            const correctOption = q.options.find(
              (o) => o.id === q.correctOptionId,
            )
            return (
              <li
                key={q.id}
                style={{ listStyle: "none", padding: 0, margin: 0 }}
              >
                <fieldset
                  aria-invalid={isWrong || undefined}
                  style={{
                    margin: 0,
                    padding: "16px 16px 14px",
                    border: "1px solid var(--line)",
                    borderRadius: 12,
                    background: "var(--bg-card)",
                  }}
                >
                  <legend
                    style={{
                      padding: "0 6px",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--ink)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: "var(--ink-3)" }}>{qIndex + 1}.</span>
                    <span>
                      {quizRichText(q.prompt[locale], `q-${q.id}-prompt`)}
                    </span>
                    {phase === "review" ? (
                      <span
                        aria-hidden
                        style={{
                          marginLeft: 6,
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 0.2,
                          color: isCorrect ? "var(--ok)" : "var(--err)",
                          background: isCorrect
                            ? "color-mix(in oklch, var(--ok) 14%, transparent)"
                            : "color-mix(in oklch, var(--err) 14%, transparent)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {isCorrect ? (
                          <CheckIcon size={11} />
                        ) : (
                          <XIcon size={11} />
                        )}
                        {isCorrect ? t.correctBadge : t.wrongBadge}
                      </span>
                    ) : null}
                  </legend>

                  <div
                    role="radiogroup"
                    aria-label={q.prompt[locale]}
                    style={{
                      marginTop: 10,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    {q.options.map((opt) => {
                      const checked = selected === opt.id
                      const isCorrectOpt =
                        phase === "review" && opt.id === q.correctOptionId
                      const isPickedWrong =
                        phase === "review" &&
                        checked &&
                        opt.id !== q.correctOptionId
                      let optBorder = "1px solid var(--line)"
                      let optBg = "var(--bg-elev)"
                      let optColor = "var(--ink)"
                      if (phase === "review") {
                        if (isCorrectOpt) {
                          optBorder = "1px solid var(--ok)"
                          optBg =
                            "color-mix(in oklch, var(--ok) 10%, var(--bg-elev))"
                        } else if (isPickedWrong) {
                          optBorder = "1px solid var(--err)"
                          optBg =
                            "color-mix(in oklch, var(--err) 10%, var(--bg-elev))"
                          optColor = "var(--ink)"
                        }
                      } else if (checked) {
                        optBorder = "1px solid var(--ink-3)"
                      }
                      return (
                        <label
                          key={opt.id}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            padding: "10px 12px",
                            border: optBorder,
                            borderRadius: 9,
                            background: optBg,
                            color: optColor,
                            cursor: phase === "review" ? "default" : "pointer",
                            fontSize: 14,
                            lineHeight: 1.45,
                          }}
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={opt.id}
                            checked={checked || false}
                            disabled={phase === "review"}
                            onChange={() => onPick(q.id, opt.id)}
                            style={{
                              marginTop: 3,
                              accentColor: "var(--accent-color)",
                              flexShrink: 0,
                            }}
                          />
                          <span>
                            {quizRichText(
                              opt.label[locale],
                              `q-${q.id}-opt-${opt.id}`,
                            )}
                          </span>
                        </label>
                      )
                    })}
                  </div>

                  {phase === "review" ? (
                    <div
                      style={{
                        marginTop: 12,
                        padding: "10px 12px",
                        border: "1px dashed var(--line)",
                        borderRadius: 9,
                        background: "var(--bg-tile)",
                        fontSize: 13.5,
                        lineHeight: 1.55,
                        color: "var(--ink-2)",
                      }}
                    >
                      {isWrong && selected ? (
                        <p style={{ margin: "0 0 8px" }}>
                          <strong style={{ color: "var(--ink)" }}>
                            {t.correctAnswer}:
                          </strong>{" "}
                          {correctOption
                            ? quizRichText(
                                correctOption.label[locale],
                                `q-${q.id}-correct`,
                              )
                            : null}
                        </p>
                      ) : null}
                      <p style={{ margin: 0 }}>
                        <strong style={{ color: "var(--ink)" }}>
                          {t.rationale}:
                        </strong>{" "}
                        {quizRichText(
                          q.rationale[locale],
                          `q-${q.id}-rationale`,
                        )}
                      </p>
                    </div>
                  ) : null}
                </fieldset>
              </li>
            )
          })}
        </ol>

        {error ? (
          <p
            role="alert"
            style={{
              marginTop: 12,
              fontSize: 13,
              color: "var(--err)",
            }}
          >
            {error}
          </p>
        ) : null}

        <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
          {phase === "editing" ? (
            <button
              type="submit"
              data-testid="learn-quiz-submit"
              style={{
                height: 36,
                padding: "0 16px",
                fontSize: 13,
                fontWeight: 600,
                background: "var(--accent-color)",
                color: "var(--accent-ink)",
                border: "1px solid var(--accent-color)",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              {t.submit}
            </button>
          ) : (
            <button
              type="button"
              data-testid="learn-quiz-retry"
              onClick={onRetry}
              style={{
                height: 36,
                padding: "0 16px",
                fontSize: 13,
                fontWeight: 600,
                background: "transparent",
                color: "var(--ink)",
                border: "1px solid var(--line)",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              {t.retry}
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
