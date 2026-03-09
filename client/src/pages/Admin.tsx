import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  LogOut,
  User,
  Calendar,
  Settings,
  Briefcase,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import type {
  Specialist,
  SpecialistSchedule,
  Service,
  ServiceSchedule,
  SiteSetting,
} from "@shared/schema";

type SpecialistWithSchedules = Specialist & { schedules: SpecialistSchedule[] };
type ServiceWithSchedules = Service & { schedules: ServiceSchedule[] };

// ═══════════════════════════════════════════════════════════
// LOGIN GATE
// ═══════════════════════════════════════════════════════════
function LoginGate({
  onLogin,
}: {
  onLogin: (password: string) => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onLogin(password);
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Connection error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-brand-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Panel</CardTitle>
          <p className="text-muted-foreground text-sm">
            Setor Saúde Management
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-dark" disabled={loading}>
              {loading ? "Checking..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// IMAGE UPLOADER
// ═══════════════════════════════════════════════════════════
function ImageUploader({
  currentUrl,
  onUploaded,
}: {
  currentUrl?: string | null;
  onUploaded: (url: string) => void;
}) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Max file size is 2MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        const res = await apiRequest("POST", "/api/admin/upload-image", {
          filename: file.name,
          contentType: file.type,
          data: base64,
        });
        const data = await res.json();
        setPreview(data.url);
        onUploaded(data.url);
        toast({ title: "Image uploaded!" });
      };
      reader.readAsDataURL(file);
    } catch {
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-24 h-24 object-cover rounded-lg border"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/logo1.svg";
          }}
        />
      )}
      <div className="flex items-center gap-2">
        <Label
          htmlFor="image-upload"
          className="cursor-pointer flex items-center gap-2 bg-muted px-4 py-2 rounded-lg text-sm hover:bg-muted/80 transition-colors"
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload Image"}
        </Label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">or paste URL:</span>
        <Input
          value={preview || ""}
          onChange={(e) => {
            setPreview(e.target.value);
            onUploaded(e.target.value);
          }}
          placeholder="https://..."
          className="text-xs h-8"
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SPECIALIST MANAGEMENT TAB
// ═══════════════════════════════════════════════════════════
function SpecialistsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    specialtyEn: "",
    specialtyPt: "",
    bioEn: "",
    bioPt: "",
    imageUrl: "",
    sortOrder: 0,
  });
  const [scheduleForm, setScheduleForm] = useState({
    dateType: "weekdays",
    dateValue: "",
    availableText: "",
    recurringType: "ongoing" as "one_off" | "ongoing",
    daysOfWeekSelected: [] as string[],
  });
  const DAYS_OF_WEEK = [
    { value: "1", label: "Mon" },
    { value: "2", label: "Tue" },
    { value: "3", label: "Wed" },
    { value: "4", label: "Thu" },
    { value: "5", label: "Fri" },
    { value: "6", label: "Sat" },
    { value: "0", label: "Sun" },
  ] as const;
  const formatDaysOfWeekLabel = (dateValue: string | null) => {
    if (!dateValue) return "";
    const labels: Record<string, string> = { "0": "Sun", "1": "Mon", "2": "Tue", "3": "Wed", "4": "Thu", "5": "Fri", "6": "Sat" };
    return dateValue.split(",").map((d) => labels[d.trim()] || d).join(", ");
  };

  // Fetch ALL specialists (including inactive) via admin endpoint
  const { data: specialists = [] } = useQuery<SpecialistWithSchedules[]>({
    queryKey: ["/api/admin/specialists"],
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/admin/specialists"] });
    queryClient.invalidateQueries({ queryKey: ["/api/specialists"] });
  };

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      if (editingId) {
        return apiRequest("PUT", `/api/admin/specialists/${editingId}`, data);
      }
      return apiRequest("POST", "/api/admin/specialists", data);
    },
    onSuccess: () => {
      invalidateAll();
      toast({ title: editingId ? "Updated!" : "Created!" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error saving", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/admin/specialists/${id}`),
    onSuccess: () => {
      invalidateAll();
      toast({ title: "Deleted!" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      apiRequest("PATCH", `/api/admin/specialists/${id}/toggle`, { isActive }),
    onSuccess: (_data, variables) => {
      invalidateAll();
      toast({
        title: variables.isActive ? "Specialist visible on site" : "Specialist hidden from site",
      });
    },
    onError: () => {
      toast({ title: "Error toggling visibility", variant: "destructive" });
    },
  });

  const addScheduleMutation = useMutation({
    mutationFn: (data: {
      specialistId: number;
      dateType: string;
      dateValue: string | null;
      availableText: string;
      recurringType?: string;
    }) => apiRequest("POST", "/api/admin/specialist-schedules", data),
    onSuccess: () => {
      invalidateAll();
      setScheduleForm({ dateType: "weekdays", dateValue: "", availableText: "", recurringType: "ongoing", daysOfWeekSelected: [] });
      toast({ title: "Schedule added!" });
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/admin/specialist-schedules/${id}`),
    onSuccess: () => {
      invalidateAll();
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      specialtyEn: "",
      specialtyPt: "",
      bioEn: "",
      bioPt: "",
      imageUrl: "",
      sortOrder: 0,
    });
  };

  const startEdit = (s: Specialist) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      specialtyEn: s.specialtyEn,
      specialtyPt: s.specialtyPt,
      bioEn: s.bioEn || "",
      bioPt: s.bioPt || "",
      imageUrl: s.imageUrl || "",
      sortOrder: s.sortOrder || 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {editingId ? "Edit Specialist" : "Add Specialist"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate(form);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Specialty (English)</Label>
                <Input
                  value={form.specialtyEn}
                  onChange={(e) => setForm({ ...form, specialtyEn: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Specialty (Português)</Label>
                <Input
                  value={form.specialtyPt}
                  onChange={(e) => setForm({ ...form, specialtyPt: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Bio (English)</Label>
                <Textarea
                  value={form.bioEn}
                  onChange={(e) => setForm({ ...form, bioEn: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>Bio (Português)</Label>
                <Textarea
                  value={form.bioPt}
                  onChange={(e) => setForm({ ...form, bioPt: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div>
              <Label>Profile Image</Label>
              <ImageUploader
                currentUrl={form.imageUrl}
                onUploaded={(url) => setForm({ ...form, imageUrl: url })}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-brand-primary hover:bg-brand-dark"
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending
                  ? "Saving..."
                  : editingId
                    ? "Update"
                    : "Add Specialist"}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Specialists List */}
      <div className="space-y-4">
        {specialists.map((s) => (
          <Card key={s.id} className={!s.isActive ? "opacity-50 border-dashed" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {s.imageUrl ? (
                    <img
                      src={s.imageUrl}
                      alt={s.name}
                      className={`w-16 h-16 rounded-lg object-cover ${!s.isActive ? "grayscale" : ""}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/logo1.svg";
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{s.name}</h3>
                      {!s.isActive && (
                        <span className="text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                          HIDDEN
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {s.specialtyEn} / {s.specialtyPt}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sort: {s.sortOrder}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Active toggle */}
                  <div className="flex items-center gap-2">
                    {s.isActive ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    )}
                    <Switch
                      checked={s.isActive}
                      onCheckedChange={(checked) =>
                        toggleActiveMutation.mutate({ id: s.id, isActive: checked })
                      }
                      disabled={toggleActiveMutation.isPending}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(s)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete {s.name}?</DialogTitle>
                      </DialogHeader>
                      <p className="text-muted-foreground">
                        This will permanently delete this specialist and all their schedules.
                      </p>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(s.id)}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Schedules */}
              <div className="mt-4 pl-20">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedules
                </h4>
                {s.schedules.map((sc) => (
                  <div
                    key={sc.id}
                    className="flex items-center justify-between py-1 text-sm"
                  >
                    <span>
                      <span className="font-medium capitalize">
                        {sc.dateType === "weekdays"
                          ? "Mon-Fri"
                          : sc.dateType === "all_week"
                            ? "All Week"
                            : sc.dateType === "days_of_week"
                              ? formatDaysOfWeekLabel(sc.dateValue)
                              : sc.dateValue}
                      </span>
                      {sc.recurringType && (
                        <span className="text-muted-foreground text-xs ml-1">
                          ({sc.recurringType === "one_off" ? "One-off" : "Ongoing"})
                        </span>
                      )}
                      : {sc.availableText}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteScheduleMutation.mutate(sc.id)}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                ))}
                {/* Add schedule inline */}
                <div className="flex flex-wrap items-end gap-2 mt-2">
                  <Select
                    value={scheduleForm.dateType}
                    onValueChange={(v) =>
                      setScheduleForm({ ...scheduleForm, dateType: v })
                    }
                  >
                    <SelectTrigger className="w-36 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekdays">Mon-Fri</SelectItem>
                      <SelectItem value="all_week">All Week</SelectItem>
                      <SelectItem value="days_of_week">Selected days</SelectItem>
                      <SelectItem value="specific">Specific Date</SelectItem>
                    </SelectContent>
                  </Select>
                  {scheduleForm.dateType === "specific" && (
                    <Input
                      type="date"
                      className="w-36 h-8 text-xs"
                      value={scheduleForm.dateValue}
                      onChange={(e) =>
                        setScheduleForm({
                          ...scheduleForm,
                          dateValue: e.target.value,
                        })
                      }
                    />
                  )}
                  {scheduleForm.dateType === "days_of_week" && (
                    <div className="flex flex-wrap gap-1 items-center">
                      {DAYS_OF_WEEK.map((d) => (
                        <label
                          key={d.value}
                          className="flex items-center gap-1 cursor-pointer text-xs border rounded px-2 py-1 hover:bg-muted/50"
                        >
                          <input
                            type="checkbox"
                            checked={scheduleForm.daysOfWeekSelected.includes(d.value)}
                            onChange={(e) => {
                              const next = e.target.checked
                                ? [...scheduleForm.daysOfWeekSelected, d.value]
                                : scheduleForm.daysOfWeekSelected.filter((x) => x !== d.value);
                              setScheduleForm({ ...scheduleForm, daysOfWeekSelected: next });
                            }}
                            className="rounded border-gray-300"
                          />
                          {d.label}
                        </label>
                      ))}
                    </div>
                  )}
                  {(["weekdays", "all_week"] as const).includes(scheduleForm.dateType) && (
                    <Select
                      value={scheduleForm.recurringType}
                      onValueChange={(v: "one_off" | "ongoing") =>
                        setScheduleForm({ ...scheduleForm, recurringType: v })
                      }
                    >
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="one_off">One-off</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  <Input
                    placeholder="e.g. 9:00 - 17:00"
                    className="w-40 h-8 text-xs"
                    value={scheduleForm.availableText}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        availableText: e.target.value,
                      })
                    }
                  />
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-brand-primary hover:bg-brand-dark"
                    onClick={() => {
                      const dateValue =
                        scheduleForm.dateType === "specific"
                          ? scheduleForm.dateValue
                          : scheduleForm.dateType === "days_of_week"
                            ? scheduleForm.daysOfWeekSelected.length > 0
                              ? [...scheduleForm.daysOfWeekSelected].sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).join(",")
                              : null
                            : null;
                      if (scheduleForm.dateType === "days_of_week" && !dateValue) return;
                      const recurringType =
                        scheduleForm.dateType === "specific"
                          ? "one_off"
                          : scheduleForm.dateType === "days_of_week"
                            ? "ongoing"
                            : scheduleForm.recurringType;
                      addScheduleMutation.mutate({
                        specialistId: s.id,
                        dateType: scheduleForm.dateType,
                        dateValue,
                        availableText: scheduleForm.availableText,
                        recurringType,
                      });
                    }}
                    disabled={
                      !scheduleForm.availableText ||
                      (scheduleForm.dateType === "days_of_week" && scheduleForm.daysOfWeekSelected.length === 0)
                    }
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SERVICES MANAGEMENT TAB
// ═══════════════════════════════════════════════════════════
function ServicesTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    providerName: "",
    serviceEn: "",
    servicePt: "",
    bioEn: "",
    bioPt: "",
    imageUrl: "",
    sortOrder: 0,
  });
  const [scheduleForm, setScheduleForm] = useState({
    dateType: "weekdays",
    dateValue: "",
    availabilityText: "",
    recurringType: "ongoing" as "one_off" | "ongoing",
    daysOfWeekSelected: [] as string[],
  });
  const DAYS_OF_WEEK = [
    { value: "1", label: "Mon" },
    { value: "2", label: "Tue" },
    { value: "3", label: "Wed" },
    { value: "4", label: "Thu" },
    { value: "5", label: "Fri" },
    { value: "6", label: "Sat" },
    { value: "0", label: "Sun" },
  ] as const;
  const formatDaysOfWeekLabel = (dateValue: string | null) => {
    if (!dateValue) return "";
    const labels: Record<string, string> = { "0": "Sun", "1": "Mon", "2": "Tue", "3": "Wed", "4": "Thu", "5": "Fri", "6": "Sat" };
    return dateValue.split(",").map((d) => labels[d.trim()] || d).join(", ");
  };

  // Fetch ALL services (including inactive) via admin endpoint
  const { data: services = [] } = useQuery<ServiceWithSchedules[]>({
    queryKey: ["/api/admin/services"],
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
    queryClient.invalidateQueries({ queryKey: ["/api/services"] });
  };

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      if (editingId) {
        return apiRequest("PUT", `/api/admin/services/${editingId}`, data);
      }
      return apiRequest("POST", "/api/admin/services", data);
    },
    onSuccess: () => {
      invalidateAll();
      toast({ title: editingId ? "Updated!" : "Created!" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error saving", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/admin/services/${id}`),
    onSuccess: () => {
      invalidateAll();
      toast({ title: "Deleted!" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      apiRequest("PATCH", `/api/admin/services/${id}/toggle`, { isActive }),
    onSuccess: (_data, variables) => {
      invalidateAll();
      toast({
        title: variables.isActive ? "Service visible on site" : "Service hidden from site",
      });
    },
    onError: () => {
      toast({ title: "Error toggling visibility", variant: "destructive" });
    },
  });

  const addScheduleMutation = useMutation({
    mutationFn: (data: {
      serviceId: number;
      dateType: string;
      dateValue: string | null;
      availabilityText: string;
      recurringType?: string;
    }) => apiRequest("POST", "/api/admin/service-schedules", data),
    onSuccess: () => {
      invalidateAll();
      setScheduleForm({ dateType: "weekdays", dateValue: "", availabilityText: "", recurringType: "ongoing", daysOfWeekSelected: [] });
      toast({ title: "Schedule added!" });
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/admin/service-schedules/${id}`),
    onSuccess: () => {
      invalidateAll();
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      providerName: "",
      serviceEn: "",
      servicePt: "",
      bioEn: "",
      bioPt: "",
      imageUrl: "",
      sortOrder: 0,
    });
  };

  const startEdit = (s: Service) => {
    setEditingId(s.id);
    setForm({
      providerName: s.providerName,
      serviceEn: s.serviceEn,
      servicePt: s.servicePt,
      bioEn: s.bioEn || "",
      bioPt: s.bioPt || "",
      imageUrl: s.imageUrl || "",
      sortOrder: s.sortOrder || 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            {editingId ? "Edit Service" : "Add Service"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate(form);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Provider Name</Label>
                <Input
                  value={form.providerName}
                  onChange={(e) =>
                    setForm({ ...form, providerName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <Label>Service (English)</Label>
                <Input
                  value={form.serviceEn}
                  onChange={(e) =>
                    setForm({ ...form, serviceEn: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Service (Português)</Label>
                <Input
                  value={form.servicePt}
                  onChange={(e) =>
                    setForm({ ...form, servicePt: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label>Bio (English)</Label>
                <Textarea
                  value={form.bioEn}
                  onChange={(e) => setForm({ ...form, bioEn: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>Bio (Português)</Label>
                <Textarea
                  value={form.bioPt}
                  onChange={(e) => setForm({ ...form, bioPt: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div>
              <Label>Profile Image</Label>
              <ImageUploader
                currentUrl={form.imageUrl}
                onUploaded={(url) => setForm({ ...form, imageUrl: url })}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-brand-primary hover:bg-brand-dark"
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending
                  ? "Saving..."
                  : editingId
                    ? "Update"
                    : "Add Service"}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Services List */}
      <div className="space-y-4">
        {services.map((s) => (
          <Card key={s.id} className={!s.isActive ? "opacity-50 border-dashed" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {s.imageUrl ? (
                    <img
                      src={s.imageUrl}
                      alt={s.providerName}
                      className={`w-16 h-16 rounded-lg object-cover ${!s.isActive ? "grayscale" : ""}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/logo1.svg";
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{s.providerName}</h3>
                      {!s.isActive && (
                        <span className="text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                          HIDDEN
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {s.serviceEn} / {s.servicePt}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sort: {s.sortOrder}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Active toggle */}
                  <div className="flex items-center gap-2">
                    {s.isActive ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    )}
                    <Switch
                      checked={s.isActive}
                      onCheckedChange={(checked) =>
                        toggleActiveMutation.mutate({ id: s.id, isActive: checked })
                      }
                      disabled={toggleActiveMutation.isPending}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(s)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete {s.providerName}?</DialogTitle>
                      </DialogHeader>
                      <p className="text-muted-foreground">
                        This will permanently delete this service and all
                        schedules.
                      </p>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(s.id)}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Schedules */}
              <div className="mt-4 pl-20">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedules
                </h4>
                {s.schedules.map((sc) => (
                  <div
                    key={sc.id}
                    className="flex items-center justify-between py-1 text-sm"
                  >
                    <span>
                      <span className="font-medium capitalize">
                        {sc.dateType === "weekdays"
                          ? "Mon-Fri"
                          : sc.dateType === "all_week"
                            ? "All Week"
                            : sc.dateType === "days_of_week"
                              ? formatDaysOfWeekLabel(sc.dateValue)
                              : sc.dateValue}
                      </span>
                      {sc.recurringType && (
                        <span className="text-muted-foreground text-xs ml-1">
                          ({sc.recurringType === "one_off" ? "One-off" : "Ongoing"})
                        </span>
                      )}
                      : {sc.availabilityText}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteScheduleMutation.mutate(sc.id)}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                ))}
                <div className="flex flex-wrap items-end gap-2 mt-2">
                  <Select
                    value={scheduleForm.dateType}
                    onValueChange={(v) =>
                      setScheduleForm({ ...scheduleForm, dateType: v })
                    }
                  >
                    <SelectTrigger className="w-36 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekdays">Mon-Fri</SelectItem>
                      <SelectItem value="all_week">All Week</SelectItem>
                      <SelectItem value="days_of_week">Selected days</SelectItem>
                      <SelectItem value="specific">Specific Date</SelectItem>
                    </SelectContent>
                  </Select>
                  {scheduleForm.dateType === "specific" && (
                    <Input
                      type="date"
                      className="w-36 h-8 text-xs"
                      value={scheduleForm.dateValue}
                      onChange={(e) =>
                        setScheduleForm({
                          ...scheduleForm,
                          dateValue: e.target.value,
                        })
                      }
                    />
                  )}
                  {scheduleForm.dateType === "days_of_week" && (
                    <div className="flex flex-wrap gap-1 items-center">
                      {DAYS_OF_WEEK.map((d) => (
                        <label
                          key={d.value}
                          className="flex items-center gap-1 cursor-pointer text-xs border rounded px-2 py-1 hover:bg-muted/50"
                        >
                          <input
                            type="checkbox"
                            checked={scheduleForm.daysOfWeekSelected.includes(d.value)}
                            onChange={(e) => {
                              const next = e.target.checked
                                ? [...scheduleForm.daysOfWeekSelected, d.value]
                                : scheduleForm.daysOfWeekSelected.filter((x) => x !== d.value);
                              setScheduleForm({ ...scheduleForm, daysOfWeekSelected: next });
                            }}
                            className="rounded border-gray-300"
                          />
                          {d.label}
                        </label>
                      ))}
                    </div>
                  )}
                  {(["weekdays", "all_week"] as const).includes(scheduleForm.dateType) && (
                    <Select
                      value={scheduleForm.recurringType}
                      onValueChange={(v: "one_off" | "ongoing") =>
                        setScheduleForm({ ...scheduleForm, recurringType: v })
                      }
                    >
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="one_off">One-off</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  <Input
                    placeholder="e.g. 9:00 - 17:00"
                    className="w-40 h-8 text-xs"
                    value={scheduleForm.availabilityText}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        availabilityText: e.target.value,
                      })
                    }
                  />
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-brand-primary hover:bg-brand-dark"
                    onClick={() => {
                      const dateValue =
                        scheduleForm.dateType === "specific"
                          ? scheduleForm.dateValue
                          : scheduleForm.dateType === "days_of_week"
                            ? scheduleForm.daysOfWeekSelected.length > 0
                              ? [...scheduleForm.daysOfWeekSelected].sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).join(",")
                              : null
                            : null;
                      if (scheduleForm.dateType === "days_of_week" && !dateValue) return;
                      const recurringType =
                        scheduleForm.dateType === "specific"
                          ? "one_off"
                          : scheduleForm.dateType === "days_of_week"
                            ? "ongoing"
                            : scheduleForm.recurringType;
                      addScheduleMutation.mutate({
                        serviceId: s.id,
                        dateType: scheduleForm.dateType,
                        dateValue,
                        availabilityText: scheduleForm.availabilityText,
                        recurringType,
                      });
                    }}
                    disabled={
                      !scheduleForm.availabilityText ||
                      (scheduleForm.dateType === "days_of_week" && scheduleForm.daysOfWeekSelected.length === 0)
                    }
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SETTINGS TAB
// ═══════════════════════════════════════════════════════════
function SettingsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: settings = [] } = useQuery<SiteSetting[]>({
    queryKey: ["/api/admin/settings"],
  });

  const settingsMap = settings.reduce(
    (acc, s) => {
      acc[s.key] = { valueEn: s.valueEn || "", valuePt: s.valuePt || "" };
      return acc;
    },
    {} as Record<string, { valueEn: string; valuePt: string }>,
  );

  const [formData, setFormData] = useState<
    Record<string, { valueEn: string; valuePt: string }>
  >({});

  useEffect(() => {
    if (settings.length > 0) {
      setFormData(settingsMap);
    }
  }, [settings]);

  const updateSetting = useMutation({
    mutationFn: async ({
      key,
      valueEn,
      valuePt,
    }: {
      key: string;
      valueEn: string;
      valuePt: string;
    }) => apiRequest("PUT", `/api/admin/settings/${key}`, { valueEn, valuePt }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Setting saved!" });
    },
  });

  const settingFields = [
    {
      key: "emergency_banner",
      label: "Emergency Banner (scrolling red bar)",
      isLong: false,
    },
    {
      key: "about",
      label: "About Page Text",
      isLong: true,
    },
    {
      key: "weekday_hours",
      label: "Weekday Hours",
      isLong: false,
    },
    {
      key: "saturday_hours",
      label: "Saturday Hours",
      isLong: false,
    },
  ];

  return (
    <div className="space-y-6">
      {settingFields.map((field) => (
        <Card key={field.key}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="w-4 h-4" />
              {field.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>English</Label>
                {field.isLong ? (
                  <Textarea
                    value={formData[field.key]?.valueEn || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.key]: {
                          ...formData[field.key],
                          valueEn: e.target.value,
                        },
                      })
                    }
                    rows={4}
                  />
                ) : (
                  <Input
                    value={formData[field.key]?.valueEn || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.key]: {
                          ...formData[field.key],
                          valueEn: e.target.value,
                        },
                      })
                    }
                  />
                )}
              </div>
              <div>
                <Label>Português</Label>
                {field.isLong ? (
                  <Textarea
                    value={formData[field.key]?.valuePt || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.key]: {
                          ...formData[field.key],
                          valuePt: e.target.value,
                        },
                      })
                    }
                    rows={4}
                  />
                ) : (
                  <Input
                    value={formData[field.key]?.valuePt || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.key]: {
                          ...formData[field.key],
                          valuePt: e.target.value,
                        },
                      })
                    }
                  />
                )}
              </div>
            </div>
            <Button
              onClick={() =>
                updateSetting.mutate({
                  key: field.key,
                  valueEn: formData[field.key]?.valueEn || "",
                  valuePt: formData[field.key]?.valuePt || "",
                })
              }
              className="bg-brand-primary hover:bg-brand-dark"
              disabled={updateSetting.isPending}
            >
              {updateSetting.isPending ? "Saving..." : "Save"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN ADMIN PAGE
// ═══════════════════════════════════════════════════════════
export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    document.title = "Admin | Setor Saúde";
    // Prevent indexing of admin page
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex, nofollow";

    // Check if already logged in
    const token = sessionStorage.getItem("admin_token");
    if (token) setIsLoggedIn(true);

    return () => {
      if (meta) meta.content = "index, follow";
    };
  }, []);

  const handleLogin = (password: string) => {
    sessionStorage.setItem("admin_token", password);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginGate onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo2.svg"
              alt="Setor Saúde"
              className="h-8"
            />
            <span className="text-sm font-medium text-muted-foreground">
              Admin Panel
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="specialists">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="specialists" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Specialists
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="specialists">
            <SpecialistsTab />
          </TabsContent>
          <TabsContent value="services">
            <ServicesTab />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
