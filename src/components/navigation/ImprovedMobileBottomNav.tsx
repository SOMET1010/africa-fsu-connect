
export { ImprovedMobileBottomNav } from "./ImprovedMobileBottomNav";
              
              {/* Label */}
              <span className={cn(
                "text-xs font-medium transition-all duration-300",
                isActive ? "font-semibold" : "font-normal"
              )}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
