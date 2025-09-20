"""
Structured logging for Scout ETL Pipeline
"""
import json
import time
import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from dataclasses import dataclass, asdict

@dataclass
class ETLRun:
    """ETL run metadata and logging"""
    run_id: str
    start_time: datetime
    environment: str
    dry_run: bool
    end_time: Optional[datetime] = None
    status: str = "running"
    steps: list = None
    metrics: dict = None
    errors: list = None

    def __post_init__(self):
        if self.steps is None:
            self.steps = []
        if self.metrics is None:
            self.metrics = {}
        if self.errors is None:
            self.errors = []

    def log_step(self, step_name: str, status: str = "success",
                 duration_ms: Optional[int] = None, **kwargs):
        """Log a step in the ETL process"""
        step_data = {
            "step": step_name,
            "status": status,
            "timestamp": datetime.utcnow().isoformat(),
            **kwargs
        }

        if duration_ms is not None:
            step_data["duration_ms"] = duration_ms

        self.steps.append(step_data)

        # Print structured log
        log_entry = {
            "run_id": self.run_id,
            "level": "INFO" if status == "success" else "ERROR",
            "message": f"ETL Step: {step_name}",
            "data": step_data
        }
        print(json.dumps(log_entry, default=str))

    def log_metric(self, metric_name: str, value: Any):
        """Log a metric for this run"""
        self.metrics[metric_name] = value

        log_entry = {
            "run_id": self.run_id,
            "level": "INFO",
            "message": f"Metric: {metric_name}",
            "data": {"metric": metric_name, "value": value}
        }
        print(json.dumps(log_entry, default=str))

    def log_error(self, error_type: str, error_message: str, **kwargs):
        """Log an error for this run"""
        error_data = {
            "type": error_type,
            "message": error_message,
            "timestamp": datetime.utcnow().isoformat(),
            **kwargs
        }

        self.errors.append(error_data)

        log_entry = {
            "run_id": self.run_id,
            "level": "ERROR",
            "message": f"ETL Error: {error_type}",
            "data": error_data
        }
        print(json.dumps(log_entry, default=str))

    def finish(self, ok: bool = True):
        """Finish the ETL run"""
        self.end_time = datetime.utcnow()
        self.status = "success" if ok else "failed"

        duration_seconds = (self.end_time - self.start_time).total_seconds()

        log_entry = {
            "run_id": self.run_id,
            "level": "INFO",
            "message": f"ETL Run Finished: {self.status}",
            "data": {
                "status": self.status,
                "duration_seconds": duration_seconds,
                "steps_count": len(self.steps),
                "errors_count": len(self.errors),
                "metrics": self.metrics
            }
        }
        print(json.dumps(log_entry, default=str))

    def to_dict(self) -> Dict[str, Any]:
        """Convert run to dictionary for serialization"""
        return asdict(self)

def log_run(environment: str = "development", dry_run: bool = True) -> ETLRun:
    """Initialize a new ETL run with logging"""
    run_id = str(uuid.uuid4())[:8]
    start_time = datetime.utcnow()

    run = ETLRun(
        run_id=run_id,
        start_time=start_time,
        environment=environment,
        dry_run=dry_run
    )

    log_entry = {
        "run_id": run_id,
        "level": "INFO",
        "message": "ETL Run Started",
        "data": {
            "environment": environment,
            "dry_run": dry_run,
            "start_time": start_time.isoformat()
        }
    }
    print(json.dumps(log_entry, default=str))

    return run