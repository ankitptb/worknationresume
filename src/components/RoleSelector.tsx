import { useState } from 'react';
import { ROLE_CATEGORIES } from '@/types/resume';
import { Briefcase } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RoleSelectorProps {
  selectedRole: string | null;
  onSelect: (role: string) => void;
}

const RoleSelector = ({ selectedRole, onSelect }: RoleSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Derive the active category, prioritizing the user's manual selection, then falling back to the selectedRole's category
  const initialCategory = selectedRole 
    ? Object.entries(ROLE_CATEGORIES).find(([_, roles]) => roles.includes(selectedRole as any))?.[0] || null
    : null;
    
  const activeCategory = selectedCategory || initialCategory;

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
  };

  const handleRoleChange = (val: string) => {
    onSelect(val);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">Select Target Role <span className="text-destructive">*</span></p>
        </div>
        <p className="text-xs text-muted-foreground">Choose the role you're applying for — this helps us score your resume accurately.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-xs font-medium text-foreground">Category</label>
          <Select value={activeCategory || ''} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                {Object.keys(ROLE_CATEGORIES).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-xs font-medium text-foreground">Role</label>
          <Select 
            value={selectedRole || ''} 
            onValueChange={handleRoleChange}
            disabled={!activeCategory}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={activeCategory ? "Select a role" : "Select a category first"} />
            </SelectTrigger>
            <SelectContent>
              {activeCategory && (
                <SelectGroup>
                  <SelectLabel>{activeCategory} Roles</SelectLabel>
                  {ROLE_CATEGORIES[activeCategory as keyof typeof ROLE_CATEGORIES].map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;

