import { useState, useMemo } from 'react';
import { ROLE_CATEGORIES } from '@/types/resume';
import { Briefcase, Check, DollarSign, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface RoleSelectorProps {
  selectedRole: string | null;
  onSelect: (role: string) => void;
  expectedSalary: string;
  onSalaryChange: (val: string) => void;
}

// Flatten all roles for suggestions
const ALL_SUGGESTIONS = Object.values(ROLE_CATEGORIES).flat();

const RoleSelector = ({ selectedRole, onSelect, expectedSalary, onSalaryChange }: RoleSelectorProps) => {
  const [open, setOpen] = useState(false);

  const filteredSuggestions = useMemo(() => {
    if (!selectedRole) return ALL_SUGGESTIONS;
    return ALL_SUGGESTIONS.filter(s => 
      s.toLowerCase().includes(selectedRole.toLowerCase())
    ).slice(0, 8);
  }, [selectedRole]);

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="space-y-5">
        <div className="space-y-2 relative">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-foreground">Target Role <span className="text-destructive">*</span></p>
          </div>
          
          <Popover open={open && !!selectedRole && selectedRole.length > 0} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  placeholder="e.g. Product Manager, Frontend Developer..."
                  value={selectedRole || ''}
                  onChange={(e) => {
                    onSelect(e.target.value);
                    if (e.target.value.length > 0) {
                      setOpen(true);
                    } else {
                      setOpen(false);
                    }
                  }}
                  className="w-full pl-9 h-11 border-primary/20 focus:border-primary transition-all shadow-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </PopoverTrigger>
            <PopoverContent 
              className="p-0 border-none shadow-none bg-transparent w-[var(--radix-popover-trigger-width)]" 
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="mt-1 bg-popover border border-primary/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                <Command className="bg-transparent">
                  <CommandList className="max-h-[250px]">
                    <CommandGroup heading="Suggested Roles" className="p-2">
                      {filteredSuggestions.map((suggestion) => (
                        <CommandItem
                          key={suggestion}
                          value={suggestion}
                          onSelect={() => {
                            onSelect(suggestion);
                            setOpen(false);
                          }}
                          className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors"
                        >
                          <span className="text-sm">{suggestion}</span>
                          <Check
                            className={cn(
                              "h-4 w-4 text-primary",
                              selectedRole?.toLowerCase() === suggestion.toLowerCase() ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            </PopoverContent>
          </Popover>
          <p className="text-[10px] text-muted-foreground px-1 pl-9">
            Type your role. We'll suggest common ones as you type.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-foreground">Expected Salary (Optional)</p>
          </div>
          <div className="relative">
            <Input 
              placeholder="e.g. $120,000 or 15 LPA" 
              value={expectedSalary}
              onChange={(e) => onSalaryChange(e.target.value)}
              className="w-full h-11 border-primary/10 focus:border-primary transition-all shadow-sm"
            />
          </div>
          <p className="text-[10px] text-muted-foreground px-1">
            Our AI will evaluate if this aligns with market standards for your level.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;

