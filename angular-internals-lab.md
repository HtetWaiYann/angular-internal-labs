
# Angular Internals Lab

## Overview
Interactive platform that visualizes Angular internals such as change detection, signals, RxJS streams, routing lifecycle, and dependency injection in real time.

---

## Features

### Change Detection Lab
- Toggle Default vs OnPush vs Signal rendering
- Zone vs Zoneless mode
- Render cycle counter
- Dirty component highlighter
- Component tree viewer
- Manual detectChanges triggers
- Timeline chart

### Signals Playground
- Dependency graph
- Computed recalculation tracker
- Effect execution log
- Circular dependency detection
- Batching visualizer
- Mutation vs immutable comparison

### RxJS Execution Lab
- Stream builder UI
- Operator chain visualization
- Emission timeline
- Subscription lifecycle graph
- Concurrency simulator
- Error + retry visualization
- Cold vs hot comparison

### Router Lifecycle Visualizer
- Navigation timeline
- Guard order
- Resolver timing
- Lazy loading visualization
- Route reuse simulator
- Nested outlet tree

### Dependency Injection Explorer
- Injector hierarchy
- Instance timeline
- Provider scope comparison
- Token resolution tracker
- Injection tracing

### Teaching Mode
Explains what happened and why.

---

## System Design

### Architecture Layers

UI Layer  
↓  
Visualization Engine  
↓  
Runtime Adapter  
↓  
Event Capture Layer  
↓  
Instrumentation Hooks  

---

### Instrumentation Layer
Captures:
- renders
- signals
- router events
- DI resolution
- RxJS emissions

Hooks:
- ChangeDetectionHook
- SignalHook
- RouterHook
- DIHook
- RxJSHook

---

### Event Bus Layer
Central stream:

eventBus$: Subject<RuntimeEvent>

Used for logging, replay, visualization.

---

### Simulation Engine Modules
- RenderEngine
- SignalEngine
- RouterEngine
- DIEngine
- StreamEngine

Outputs:
- EngineStateSignal
- EngineMetricsSignal
- EngineTimelineSignal

---

### State Architecture

EventStream (RxJS)
↓
Engine processors
↓
Signals Store
↓
UI

---

### Visualization Engine
Responsible for rendering:
- graphs
- timelines
- trees
- animations

Rendering methods:
- SVG graphs
- Canvas timelines
- DOM panels

---

### Replay Engine

RecordedSession:
- timestamp
- eventType
- payload

Uses virtual clock stream.

---

### Runtime Data Flow

User Interaction
↓
Angular Runtime
↓
Hooks
↓
Event Bus
↓
Simulation Engine
↓
Signals Store
↓
Visualizer UI

---

## Engineering Decisions
- Decoupled runtime capture from UI
- Signals for deterministic state
- RxJS for streaming events
- Custom instrumentation layer
- Virtual clock replay engine
- Modular simulation engines

---

## Tech Stack
- Angular (latest)
- RxJS 7+
- TypeScript strict
- Standalone components
- Web Workers
- Canvas API
- IndexedDB

---

## Goal
Demonstrate deep understanding of Angular internals, reactive systems, runtime behavior, and performance profiling.

