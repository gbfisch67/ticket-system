import { LuChevronUp, LuMinus, LuChevronDown } from "react-icons/lu";
import './PriorityBadge.css'

const PriorityBadge = ({ priority }: { priority: string }) => {
    const getPriorityBadge = (priority: string)=> {
        switch (priority.toLowerCase()) {
            case 'high':
                return {
                    icon: <LuChevronUp className="priority-icon-high"/>,
                    label: 'high'
                };
            case 'medium':
                return {
                    icon: <LuMinus className="priority-icon-medium"/>,
                    label: 'medium'
                };
            case 'low':
            default:
                return {
                    icon: <LuChevronDown className="priority-icon-low"/>,
                    label: 'low'
                };
        }
    };

    const config = getPriorityBadge(priority);

    return (
        <div className="ticket-priority-badge">
            {config.label}
            <div className="priority-icon-wrapper">
                {config.icon}
                {config.icon}
            </div>
        </div>
    )
}

export default PriorityBadge