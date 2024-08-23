import { Control } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { LuDot } from "react-icons/lu";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tag, TagInput } from "./ui/tag-input";
import { SetStateAction, useState } from "react";

type CustomFormFieldProps = {
  name: string;
  control: Control<any>;
  title?: string;
};


type CustomPasswordFieldProps = {
  name: string;
  control: Control<any>;
  title?: string;
  value?: string;
  onChange?: (value: string) => void;
  target?: string;
};

export function CustomFormField({
  name,
  control,
  title,
}: CustomFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="capitalize">{title || name}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CustomFormFieldFile({
  name,
  title,
  control,
  value,
}: {
  name: string;
  control: Control<any>;
  value: string;
  title?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={value}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="capitalize">{title || name}</FormLabel>
          <FormControl>
            <Input {...field} disabled value={value} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CustomFormTextArea({
  name,
  control,
  title,
}: CustomFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="capitalize">{title || name}</FormLabel>
          <FormControl>
            <Textarea className="resize-none" rows={7} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type CustomFormSelectProps = {
  name: string;
  control: Control<any>;
  items: string[];
  labelText?: string;
};

export function CustomFormSelect({
  name,
  control,
  items,
  labelText,
}: CustomFormSelectProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel className="capitalize">{labelText || name}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl className="capitalize">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {items.map((item) => {
                  return (
                    <SelectItem className="capitalize" key={item} value={item}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export function CustomTagField({
  name,
  title,
  control,
  tagsList,
  setValue,
  setTagsList,
}: {
  name: string;
  control: Control<any>;
  title?: string;
  tagsList: Tag[];
  setTagsList: any;
  setValue: any;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="capitalize">{title || name}</FormLabel>
          <FormControl>
            <TagInput
              {...field}
              tags={tagsList}
              setTags={(newTags) => {
                setTagsList(newTags);
                setValue(name, newTags as [Tag, ...Tag[]]);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CustomPasswordField({
  name,
  control,
  title,
}: CustomPasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const formatPassword = (value: string) => {
    if (!value) return '';
    return value
      .slice(0, 16)
      .match(/.{1,4}/g)
      ?.join('・') || '';
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="capitalize">{title || name}</FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                type={showPassword ? "text" : "password"}
                {...field}
                value={formatPassword(field.value || '')} 
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                  field.onChange(rawValue); 
                }}
                className="pr-10"
              />
            </FormControl>
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEyeSlash className="h-5 w-5 text-gray-500" />
              ) : (
                <FaEye className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}