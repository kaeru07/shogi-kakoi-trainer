'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ShogiBoard from '../../components/ShogiBoard'
import BottomNav from '../../components/BottomNav'
import type { Castle } from '../../lib/types'
import { recordLearned } from '../../lib/learningRecords'

type Props = {
  castle: Castle
}

export default function GuideClient({ castle }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [selectedCell, setSelectedCell] = useState<{ col: number; row: number } | null>(null)

  const steps = castle.guideSteps
  const totalSteps = steps.length
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  useEffect(() => {
    if (isLastStep) {
      recordLearned(castle.id, castle.name)
    }
  }, [isLastStep, castle.id, castle.name])
  const currentStepData = steps[currentStep]
  const progressPercent = totalSteps > 1
    ? Math.round((currentStep / (totalSteps - 1)) * 100)
    : 0

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(s => s + 1)
      setShowHint(false)
      setSelectedCell(null)
    }
  }
  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(s => s - 1)
      setShowHint(false)
      setSelectedCell(null)
    }
  }
  const handleReset = () => {
    setCurrentStep(0)
    setShowHint(false)
    setSelectedCell(null)
  }

  const handleCellClick = (col: number, row: number) => {
    if (isLastStep) return
    const from = currentStepData?.from
    const to = currentStepData?.to
    if (!from || !to) return

    if (!selectedCell) {
      if (col === from.col && row === from.row) {
        setSelectedCell({ col, row })
      }
    } else {
      if (col === to.col && row === to.row) {
        handleNext()
      } else {
        setSelectedCell(col === from.col && row === from.row ? { col, row } : null)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] pb-36">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-10 pb-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href={`/castles/${castle.id}`} className="text-gray-600">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-gray-900">誘導モード</h1>
        </div>
      </header>

      <div className="px-4 py-4 space-y-3">
        {/* Target castle + progress */}
        <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-[#7B5E2A] rounded-lg flex items-center justify-center text-white font-bold text-sm">
            囲
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500">目標の囲い</div>
            <div className="font-bold text-sm text-gray-900">{castle.name}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">進行状況</div>
            <div className="font-bold text-sm text-[#7B5E2A]">{currentStep + 1} / {totalSteps}手</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2E7D32] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Board */}
        <div className="bg-[#E8DFC8] rounded-2xl p-3">
          <ShogiBoard
            pieces={currentStepData?.boardPosition ?? castle.guidePieces}
            highlight={currentStepData?.to ?? currentStepData?.highlight}
            highlightFrom={currentStepData?.from}
            selectedCell={selectedCell ?? undefined}
            onCellClick={!isLastStep && currentStepData?.from && currentStepData?.to ? handleCellClick : undefined}
          />
        </div>

        {/* Current move — big display */}
        {isLastStep ? (
          <div className="bg-[#2E7D32] text-white rounded-xl p-5 text-center shadow">
            <div className="text-3xl font-bold mb-1">囲い完成！</div>
            <div className="text-sm opacity-80">{castle.name}が完成しました</div>
            <button
              onClick={handleReset}
              className="mt-3 px-6 py-2 bg-white text-[#2E7D32] font-bold rounded-full text-sm"
            >
              最初からやり直す
            </button>
          </div>
        ) : (
          <div className="bg-[#1a2744] text-white rounded-xl p-4 shadow">
            <div className="text-xs opacity-70 mb-1">次の一手</div>
            <div className="text-2xl font-bold tracking-wider">{currentStepData?.move}</div>
            {currentStepData?.from && currentStepData?.to && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-xs opacity-70">
                  <span className="bg-yellow-300 text-yellow-900 px-1.5 py-0.5 rounded font-bold">🟡 動かす駒</span>
                  <span>→</span>
                  <span className="bg-emerald-400 text-emerald-900 px-1.5 py-0.5 rounded font-bold">🟢 移動先</span>
                </div>
                <div className="text-xs opacity-60">
                  {selectedCell ? '移動先（🟢）をタップしてください' : '動かす駒（🟡）をタップしてください'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hint */}
        {!isLastStep && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-yellow-500 text-base">💡</span>
              <span className="font-bold text-sm text-gray-800">ヒント</span>
            </div>
            {showHint ? (
              <p className="text-sm text-gray-700 leading-relaxed">{currentStepData?.hint}</p>
            ) : (
              <button
                onClick={() => setShowHint(true)}
                className="text-sm text-[#7B5E2A] font-medium underline"
              >
                ヒントを表示する
              </button>
            )}
          </div>
        )}

        {/* Achievement */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-800">達成度</span>
            <span className="text-lg font-bold text-[#2E7D32]">{progressPercent}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2E7D32] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action buttons */}
        {!isLastStep && (
          <div className="grid grid-cols-3 gap-2 pb-2">
            <button
              onClick={handlePrev}
              disabled={isFirstStep}
              className="flex items-center justify-center border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-xl bg-white disabled:opacity-40 text-sm"
            >
              ◀ 戻る
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl bg-white text-xs"
            >
              最初から
            </button>
            <button
              onClick={handleNext}
              disabled={isLastStep}
              className="flex items-center justify-center bg-[#1a2744] text-white font-bold py-3 rounded-xl shadow disabled:opacity-40 text-sm"
            >
              次へ ▶
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
