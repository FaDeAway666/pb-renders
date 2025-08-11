import './overlay.less';

const DndOverlay = ({ text }: { text: string }) => {
  return <div className="dnd-overlay">{text}</div>;
};

export default DndOverlay;
