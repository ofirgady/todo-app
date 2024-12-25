export function ProgressBar({ value }) {
    
    return (
        <div className="progress-bar-container">
            <div
                className="progress-bar-fill"
                style={{ width: `${value}%` }}
            ></div>
            <span className="progress-bar-text">{value}%</span>
        </div>
    );
}